import express from 'express'
import { addProject, deleteProject, getProject, updateProject } from '../controller/project.js'


const router = express.Router()

router.get('/', getProject)
router.post('/', addProject)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)


export default router