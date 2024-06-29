import {db} from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer';
import path from 'path'
import { fileURLToPath } from 'url';
import cors from 'cors'
import express from 'express'

const router = express.Router()
router.use(cors())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/upload')); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
  
export const register = (req, res) => {
  upload.single('profilePic')(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    const { role, fullname, username, email, password } = req.body;
    const profilePic = req.file ? req.file.filename : null;
    const join_date = new Date();

    const q = "SELECT * FROM users WHERE email=? OR username=?";
    db.query(q, [email, username], (err, data) => {
      if (err) return res.json(err);
      if (data.length) return res.status(409).json('User already exists');

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const q = "INSERT INTO users(`username`,`email`,`password`,`fullname`, `role`, `join_date`, `profilePic`) VALUES (?)";
      const values = [
        username,
        email,
        hash,
        fullname,
        role,
        join_date,
        profilePic
      ];
      
      db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json(`User created successfully`);
      });
    });
  });
};


export const updateProfile = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json('Not Authenticated');

  jwt.verify(token, 'jwtkey', (err, user) => {
    if (err) return res.status(403).json('Token Invalid');

    upload.single('profilePic')(req, res, (err) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json('Error uploading file');
      }

      const { username, email, password, fullname, role, join_date } = req.body;
      const profilePic = req.file ? req.file.filename : null;

      console.log('User:', user);
      console.log('Request body:', req.body);
      console.log('Profile Pic:', profilePic);

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      let q = "UPDATE users SET `username`=?, `email`=?, `password`=?, `fullname`=?, `role`=?, `join_date`=?";
      const values = [username, email, hash, fullname, role, join_date];

      if (profilePic) {
        q += ", `profilePic`=?";
        values.push(profilePic);
      }

      q += " WHERE `id`=?";
      values.push(user.id);

      console.log('SQL Query:', q);
      console.log('Values:', values);

      db.query(q, values, (err, data) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json(err);
        }
        return res.status(200).json('Profile Updated Successfully');
      });
    });
  });
};

export const login = (req, res) => {
    const { email, password:userPassword } = req.body;
    const q = "SELECT * FROM users WHERE email=?";
  
    db.query(q, [email], (err, data) => {
      if (err) return res.json(err);
      if (data.length == 0) return res.status(404).json('User not found!!!');
      
      // Checking password
      const isPasswordCorrect = bcrypt.compareSync(userPassword, data[0].password);
      if (!isPasswordCorrect) return res.status(400).json("username or password not correct");
  
      // Generate new token
      const token = jwt.sign({ id: data[0].id },'jwtkey', { expiresIn: '1hr' }); 
      const { password, ...other } = data[0];
  
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,  
      }).status(200).json(other);
    });
  };
  
  export const logout = (req, res) => {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "none",
      secure: true,  
    }).status(200).json("User has been logged out.");
  };

  