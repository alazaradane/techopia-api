import express from 'express'
import {getProfile, getUsers} from '../controller/profile.js'
const router = express.Router();

router.get('/users', getUsers)
router.get('/:id', getProfile)



export default router