import {db} from '../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer';
import path from 'path'


  

  
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../tech-api/public/upload');
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
      const token = jwt.sign({ id: data[0].id },'jwtkey', { expiresIn: '5m' }); 
      const { password, ...other } = data[0];
  
      res.cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,  // use secure:true for HTTPS
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