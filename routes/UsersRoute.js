import express from 'express';
import { login, register, message } from '../controllers/UserController.js';
 
const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/message').post(message);

export default router;