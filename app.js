import express from 'express';
// import  {config} from 'dotenv'
import paymentRoute from './routes/PaymentRouter.js'
import cors from 'cors';
import verify from "./routes/Verify.js"
import user from "./routes/UsersRoute.js"
// config({path:'./config/config.js'});
require('dotenv').config()

export const   app=express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api',paymentRoute);
app.use('/verify',verify)
app.use('/user',user)
app.post('/api/key',(req,res)=>res.json({key:process.env.RAZORPAY_API_KEY}))

app.get("/",(req,res)=>res.send("Working"));