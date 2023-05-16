import express from 'express';
import { checkout, getAllPayment, getpayment, paymentverification,paymentverificationadmin } from '../controllers/PaymentController.js';
 
const router=express.Router();
router.route('/checkout').post(checkout)
router.route('/paymentverification').post(paymentverification)
router.route('/paymentverificationadmin').post(paymentverificationadmin)
router.route('/getDetails').post(getpayment)
router.route('/getall').post(getAllPayment);

export default router;