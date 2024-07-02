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


export const getUsers = (req, res) => {
    const q = "SELECT * FROM users";
    
    db.query(q,(err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (data.length === 0) {
        return res.status(404).json({ message: "No Users found"})
      }
      return res.status(200).json(data);
    });
  };

export const deleteUser = (req,res)=>{
  const {id} = req.params
  const q = "DELETE FROM users WHERE id=?"
  db.query(q,[id],(err,data)=>{
    if(err) return res.status(500).json('Internal Server Error')
    if(data.length===0) return res.status(404).json('User not found')
      return res.status(200).json('User deleted')
  })
}
