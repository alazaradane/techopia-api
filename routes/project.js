import express from 'express'

const router = express.Router()

router.get('/', getProject)
router.post('/', addProject)
router.put('/:id', updateProject)
router.delete('/:id', deleteProject)

export default router