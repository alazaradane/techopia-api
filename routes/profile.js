import express from 'express'
import {getProfile, getUsers, deleteUser} from '../controller/profile.js'
const router = express.Router();

router.get('/users', getUsers)
router.delete('/users/:id', deleteUser)
router.get('/:id', getProfile)



export default router