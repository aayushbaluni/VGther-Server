

import { instance } from "../server.js"
import crypto from 'crypto'
import {PaymentModel} from "../models/PaymentModel.js"
import {OrderModel} from "../models/OrderModel.js"
import { v4 as uuidv4 } from 'uuid';
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
 const payment=await PaymentModel.create({
 razorpay_order_id:razorpay_order_id,
  razorpay_payment_id:razorpay_payment_id,
  razorpay_signature:razorpay_signature,
 });
 const orders=await OrderModel.find({order_id:razorpay_order_id});
 
 const peoples=orders[0].peoples;
 peoples.map((val,i)=>payment.tickets.push({
  name:val.name,
  number:val.number,
  ticket_number:uuidv4(),
 })
 );
 await payment.save().then((val)=>{
  console.log(val);
  res.redirect(`http://localhost:3000/paymentsucess?id=${val._id}`)

 });


}

export const getpayment=async(req,res)=>{
  const {id}=req.body;
  const result=await PaymentModel.findById(id);
  res.send(result);
}