import express from "express";
import { addEvent, updateEvent, getEvent, deleteEvent } from "../controller/event.js";

const router = express.Router()

router.get('/', getEvent)
router.post('/', addEvent)
router.put('/:id', updateEvent)
router.delete('/:id', deleteEvent)

export default router

