import express from 'express'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js'
import cors from 'cors'
import multer from 'multer';

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}))




app.use('/api/auth', authRoutes)

// app.use('/api/projects', projectRoutes)
// app.use('/api/blogs', blogRoutes)
// app.use('/api/events', eventRoutes)
// app.use('/api/newsletter', newsletterRoutes)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../tech-admin/public/upload'))
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  })
  
const upload = multer({ storage })
app.post('/api/upload', upload.single('file'), function (req, res) {
    const file = req.file
    res.status(200).json(file.filename)
  })

const PORT = process.env.PORT
app.listen(PORT,()=>{
        console.log(`Listening port ${PORT}...`)
    }
)
