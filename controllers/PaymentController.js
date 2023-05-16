

import { instance } from "../server.js"
import crypto from 'crypto'
import {PaymentModel} from "../models/PaymentModel.js"
import {OrderModel} from "../models/OrderModel.js"
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

export const checkout= async(req,res)=>{
  const notes=req.body.notes;
    const options=  {
        amount: Number(req.body.amount*100),
        currency: "INR", 
  }
  const order=await instance.orders.create(options)
  
  console.log(order);

  const orders= await OrderModel.create({
    order_id:order.id,
  });
  console.log(req.body.notes);
  req.body.notes.map((val,i)=>orders.peoples.push(val));
 const ord= await orders.save();
  console.log(orders)
  res.send({"order":order})

}


export const paymentverification=async(req,res)=>{
  console.log(req.body);
  let body=req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
 var expectedSign=crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET).update(body.toString()).digest('hex')
 
 if(expectedSign!=req.body.razorpay_signature){
  return res.send("Sorry Wrong Information...");
 }
 var a=uuidv4().toString();
 console.log(a);
 var {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
 razorpay_order_id=razorpay_order_id.toString();
 razorpay_payment_id=razorpay_payment_id.toString();
 razorpay_signature=razorpay_signature.toString();
 console.log(razorpay_order_id);
 console.log(razorpay_payment_id);
 console.log(razorpay_signature);
 const order=await instance.orders.fetch(razorpay_order_id);
 console.log(order.notes);

 const orders=await OrderModel.find({order_id:razorpay_order_id});
 const payment=await PaymentModel.create({
  parent_number:req.query.parent_number,
  referer:req.query.referer,
 razorpay_order_id:razorpay_order_id,
  razorpay_payment_id:razorpay_payment_id,
  razorpay_signature:razorpay_signature,
 });
 const peoples=orders[0].peoples;
 peoples.map((val,i)=>payment.tickets.push({
  name:val.name,
  number:val.number,
  ticket_number:uuidv4(),
 })
 );
 await payment.save().then((val)=>{
  console.log(val);
  res.redirect(`https://www.vgthr.com/paymentsucess?id=${val._id}`)

 });


}

export const paymentverificationadmin=async(req,res)=>{
  const payload = {
    waId: req.body.isLogedin.token,
  };
  const headers = {
    clientId: "02fz9i8d",
    clientSecret: "cjzgfh73hsqxgnt8",
    "Content-Type": "application/json",
  };
  const mobile=req.body.isLogedin.mobile.number;
  axios
  .post("https://vgthr.authlink.me", payload, { headers: headers })
  .then(async (response) => {
    if (response.data.statusCode === 200 && response.data.user.waNumber === mobile && response.data.user.waNumber.toString()==="919413465367") {
      var {razorpay_order_id}=req.body;
 const razorpay_payment_id = "ADMIN"
 const razorpay_signature = "ADMIN"
 const orders=await OrderModel.find({order_id:razorpay_order_id});
 const payment=await PaymentModel.create({
  parent_number:req.body.parent_number,
  referer:req.body.referer,
  amount:req.body.amount,
 razorpay_order_id:razorpay_order_id,
  razorpay_payment_id:razorpay_payment_id,
  razorpay_signature:razorpay_signature,
 });
 const peoples=orders[0].peoples;
 peoples.map((val,i)=>payment.tickets.push({
  name:val.name,
  number:val.number,
  ticket_number:uuidv4(),
 })
 );
 await payment.save().then((val)=>{
  res.send({ status: 200,ticket_id:val._id});

 });
    }
    else{
      res.send({ status: 404 });
    }
    // res.status(200).json(responseData);
  })
  .catch((err) => {
    res.send({ status: 401 });
    console.log(err);
  });


}

export const getpayment=async(req,res)=>{
  const {id}=req.body;
  const result=await PaymentModel.findById(id);
  res.send(result);
}


export const getAllPayment=async(req,res)=>{
  const payload = {
    waId: req.body.token,
  };
  const headers = {
    clientId: "02fz9i8d",
    clientSecret: "cjzgfh73hsqxgnt8",
    "Content-Type": "application/json",
  };
  const mobile=req.body.mobile.number;
  axios
  .post("https://vgthr.authlink.me", payload, { headers: headers })
  .then(async (response) => {
    if (response.data.statusCode === 200 && response.data.user.waNumber === mobile) {
      console.log("here")
      const result = await PaymentModel.find({ parent_number: mobile });
      res.send(result);
    }
    else{
      res.send({ status: 404 });
    }
    // res.status(200).json(responseData);
  })
  .catch((err) => {
    res.send({ status: 401 });
    console.log(err);
  });


  
}