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
export const getProject = (req, res) => {
    const q = "SELECT * FROM projects";
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(data);
    });
  };
  

export const addProject = (req, res) => {
  upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    const { title, detail, technology } = req.body;
    const iconFile = req.files['icon'] ? req.files['icon'][0].filename : null;
    const imageFile = req.files['image'] ? req.files['image'][0].filename : null;
    const create_date = new Date();

    const technologies = technology.split(',').map(tech => tech.trim()).join(',');

    const q = "SELECT * FROM projects WHERE title=?";
    db.query(q, [title], (err, data) => {
      if (err) return res.json(err);
      if (data.length) return res.status(409).json('Project already exists');

      const q = "INSERT INTO projects(`title`,`detail`,`icon`,`image`, `technology`, `create_date`) VALUES (?)";
      const values = [title, detail, iconFile, imageFile, technologies, create_date];

      db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Project created successfully');
      });
    });
  });
};

export const updateProject = (req, res) => {
    const { id } = req.params;
  
    upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }])(req, res, (err) => {
      if (err) {
        return res.status(500).json(err);
      }
  
      const { title, detail, technology } = req.body;
      const iconFile = req.files['icon'] ? req.files['icon'][0].filename : null;
      const imageFile = req.files['image'] ? req.files['image'][0].filename : null;
      const create_date = new Date();
      const technologies = technology.split(',').map(tech => tech.trim()).join(',');
  
      const q = "UPDATE projects SET `title`=?, `detail`=?, `icon`=?, `image`=?, `technology`=?, `create_date`=? WHERE `id`=?";
      const values = [title, detail, iconFile, imageFile, technologies, create_date, id];
  
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json('Project updated successfully');
      });
    });
  };
  
  
export const deleteProject = (req, res) => {
    const q = "DELETE FROM projects WHERE id=?";
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json('Project deleted successfully');
    });
  };

export default router;
