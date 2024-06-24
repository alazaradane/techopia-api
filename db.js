import mysql from 'mysql'
import dotenv from 'dotenv'

dotenv.config()

export const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'admin',
    database: 'techopia'
})

db.connect((err)=>{
    if(err){
        console.log('Unable to connect with database')
        return;
    }else{
        console.log('Connected to database')
    }
})