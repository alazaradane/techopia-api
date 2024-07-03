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

export const getEvent = (req, res) => {
    const q = "SELECT * FROM events";
    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json(data);
    });
  };
  

export const addEvent = (req, res) => {
  upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }])(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    const { title, detail } = req.body;
    const iconFile = req.files['icon'] ? req.files['icon'][0].filename : null;
    const imageFile = req.files['image'] ? req.files['image'][0].filename : null;
    const create_date = new Date();


    const q = "SELECT * FROM events WHERE title=?";
    db.query(q, [title], (err, data) => {
      if (err) return res.json(err);
      if (data.length) return res.status(409).json('Events already exists');

      const q = "INSERT INTO events(`title`,`detail`,`icon`,`image`, `create_date`) VALUES (?)";
      const values = [title, detail, iconFile, imageFile, create_date];

      db.query(q, [values], (err, data) => {
        if (err) return res.json(err);
        return res.status(200).json('Event created successfully');
      });
    });
  });
};

export const updateEvent = (req, res) => {
    const { id } = req.params;
  
    upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }])(req, res, (err) => {
      if (err) {
        return res.status(500).json(err);
      }
  
      const { title, detail } = req.body;
      const iconFile = req.files['icon'] ? req.files['icon'][0].filename : null;
      const imageFile = req.files['image'] ? req.files['image'][0].filename : null;
      const create_date = new Date();
  
      const q = "UPDATE events SET  `title`=?, `detail`=?, `icon`=?, `image`=?, `create_date`=? WHERE `id`=?";
      const values = [title, detail, iconFile, imageFile, create_date, id];
  
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json('Event updated successfully');
      });
    });
  };
  
  
export const deleteEvent = (req, res) => {
    const q = "DELETE FROM events WHERE id=?";
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      res.status(200).json('Event deleted successfully');
    });
  };

export default router;
