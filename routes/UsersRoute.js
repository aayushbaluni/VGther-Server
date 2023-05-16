import express from 'express';
import { login, register, message,coupon } from '../controllers/UserController.js';
 
const router=express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/message').post(message);
router.route('/coupon').post(coupon);

export default router;