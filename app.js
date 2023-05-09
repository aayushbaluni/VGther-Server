import express from 'express';
import  {config} from 'dotenv'
import paymentRoute from './routes/PaymentRouter.js'
import cors from 'cors';
import verify from "./routes/Verify.js"

config({path:'./config/config.js'});

export const   app=express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api',paymentRoute);
app.use('/verify',verify)
app.post('/api/key',(req,res)=>res.json({key:process.env.RAZORPAY_API_KEY}))