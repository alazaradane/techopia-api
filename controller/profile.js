import { db } from '../db.js';
export const getProfile = (req,res)=>{
    const {id} = req.params
    const q= "SELECT * FROM users WHERE id=?"
    db.query(q,[id],(err,data)=>{
        if(err) return res.status(400).json(err)
            if(data.length === 0) return res.status(404).json("User not found")
                return res.status(200).json(data[0])
    })
}



