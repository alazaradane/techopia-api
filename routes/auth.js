import express from 'express'

import { register, login,logout, updateProfile } from '../controller/auth.js'
const router = express.Router()

router.post('/register', register)
router.put('/updateProfile', updateProfile);
router.post('/login', login)
router.post('/logout', logout)

export default router