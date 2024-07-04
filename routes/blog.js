import express from 'express'
import { addBlog, deleteBlog, getBlog, updateBlog } from '../controller/blog.js'


const router = express.Router()

router.get('/', getBlog)
router.post('/', addBlog)
router.put('/:id', updateBlog)
router.delete('/:id', deleteBlog)


export default router