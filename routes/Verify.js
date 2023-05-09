import express from 'express'
import {getCode,verifyCode} from '../controllers/VerifyController.js';
const router=express.Router()

router.route('/getcode').post(getCode);
router.route('/verifycode').post(verifyCode);

export default  router;