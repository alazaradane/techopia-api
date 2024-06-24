import express from 'express'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/newsletter', newsletterRoutes)


const PORT = process.env.PORT
app.listen(PORT,()=>{
        console.log(`Listening port ${PORT}`)
    }
)
