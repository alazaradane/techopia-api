import express from 'express'
import cookieParser from 'cookie-parser';

const app = express();
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT
app.listen(PORT,()=>{
        console.log(`Listening port ${PORT}`)
    }
)
