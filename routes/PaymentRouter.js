import express from 'express';
import { checkout, getpayment, paymentverification } from '../controllers/PaymentController.js';
 
const router=express.Router();
router.route('/checkout').post(checkout)
router.route('/paymentverification').post(paymentverification)
router.route('/getDetails').post(getpayment)
export default router;