import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from '../db.js';

const router = express.Router();
router.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/upload'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export const getBlog = (req, res) => {
    const q = "SELECT * FROM blogs";
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(data);
    });
  };

export const getoneBlog = (req, res) => {
    const {id}= req.params
    const q = "SELECT * FROM blogs WHERE id=?";
    db.query(q,[id], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(data);
    });
  };
  

export const addBlog = (req, res) => {
  upload.fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    const { title, detail, category } = req.body;
    const imageFile = req.files['image'] ? req.files['image'][0].filename : null;
    const create_date = new Date();


    const q = "SELECT * FROM blogs WHERE title=?";
    db.query(q, [title], (err, data) => {
      if (err) return res.json(err);
      if (data.length) return res.status(409).json('Blogs already exists');

      const q = "INSERT INTO blogs(`title`,`detail`, `category`,`image`, `create_date`) VALUES (?)";
      const values = [title, detail, category, imageFile, create_date];

      db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Blog created successfully');
      });
    });
  });
};

export const updateBlog = (req, res) => {
  const { id } = req.params;

  upload.fields([{ name: 'image', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      console.error('Error during file upload:', err);
      return res.status(500).json({ message: 'File upload error', error: err });
    }

    const { title, detail, category } = req.body;
    const imageFile = req.files['image'] ? req.files['image'][0].filename : null;
    const create_date = new Date();

    let q;
    let values;

    if (imageFile) {
      q = "UPDATE blogs SET `title`=?, `detail`=?, `category`=?, `image`=?, `create_date`=? WHERE `id`=?";
      values = [title, detail, category, imageFile, create_date, id];
    } else {
      q = "UPDATE blogs SET `title`=?, `detail`=?, `category`=?, `create_date`=? WHERE `id`=?";
      values = [title, detail, category, create_date, id];
    }

    db.query(q, values, (err, data) => {
      if (err) {
        console.error('Error during database query:', err);
        return res.status(500).json({ message: 'Database query error', error: err });
      }
      return res.status(200).json('Blog updated successfully');
    });
  });
};


export const deleteBlog = (req, res) => {
    const q = "DELETE FROM blogs WHERE id=?";
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json('Blog deleted successfully');
    });
  };

export default router;
