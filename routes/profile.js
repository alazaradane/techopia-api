import express from 'express'
import {getProfile} from '../controller/profile.js'
const Router = express.Router();

Router.get('/:id', getProfile)



export default Router