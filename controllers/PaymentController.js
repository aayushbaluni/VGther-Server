

import { instance } from "../server.js"
import crypto from 'crypto'
import {PaymentModel} from "../models/PaymentModel.js"
import {OrderModel} from "../models/OrderModel.js"
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import moment from "moment-timezone"
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
  const indianTimezone = 'Asia/Kolkata';
  const refCodes = ['7IHZ', 'Y8BK', 'A49L', 'LMZH', 'LRVV', 'ZC88', 'L0BJ', 'SPZW', 'SNGH', '09AG', '3PBY', 'IEN0', '8N6J']
const currentTime = moment().tz(indianTimezone).valueOf();
var {razorpay_order_id,razorpay_payment_id,parent_number,referer}=req.body;
// if(razorpay_payment_id){
//   return res.send("Sorry Wrong Information...");
//  }
  axios.get('https://payments-tesseract.bharatpe.in/api/v1/merchant/transactions', {
    params: {
      'module': 'PAYMENT_QR',
      'merchantId': '41134598',
      'sDate': '1684261800000',
      'eDate': currentTime.toString()
    },
    headers: {
      'authority': 'payments-tesseract.bharatpe.in',
      'accept': 'application/json, text/javascript, */*; q=0.01',
      'accept-language': 'en-GB,en;q=0.8',
      'origin': 'https://enterprise.bharatpe.in',
      'referer': 'https://enterprise.bharatpe.in/',
      'sec-ch-ua': '"Chromium";v="112", "Brave";v="112", "Not:A-Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'sec-gpc': '1',
      'token': 'aa177567d8e44c448e2b7d81c0b2faa5',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
    }
  }).then(async (response)=>{
    console.log(response.data.data.transactions[0].bankReferenceNo)
    var state = true
    var index;
    for(var i=0;i<response.data.data.transactions.length;i++){
      if(response.data.data.transactions[i].bankReferenceNo==razorpay_payment_id){
        state = false;
        index = i;
        break
      }
    }
    if(state){console.log("No payment received");return res.status(200).send({status:402,error:"No payment received"}); }
    const result=await PaymentModel.find({razorpay_payment_id:razorpay_payment_id});
    if(result.length!==0){console.log("already present");return res.status(200).send({status:401,error:"Already Present"}); }
    razorpay_order_id=razorpay_order_id.toString();
 razorpay_payment_id=razorpay_payment_id.toString();
 var razorpay_signature="NA";

 const orders=await OrderModel.find({order_id:razorpay_order_id});
 var amount=0;
 for(var i=0;i<orders[0].peoples.length;i++){
  if(orders[0].peoples[i].college_id=="NA"){
    amount+=399;
  }
  else{
    amount+=299;
  }
 }
 var whoreferred;
var times = orders[0].peoples.length;
var amountFinal;

if(referer!="NA"){
  whoreferred=`91${referer}`
  const parentNumberExists = await PaymentModel.exists({ parent_number: whoreferred });

    // Counting the number of documents with the given number at the referer field
    // const refererCount = await PaymentModel.countDocuments({ referer: mobileno });
    var arr = []
      const persons = await PaymentModel.find({ referer: whoreferred })
      for(var i=0;i<persons.length;i++){
        for(var j=0;j<persons[i].tickets.length;j++){
          arr.push(persons[i].tickets[j].name)
        }
      }

    if (parentNumberExists && arr.length < 10) {
      amountFinal = amount-100*times;
      // return res.status(200).send({status:200});
    } else if (arr.length >= 10) {
      whoreferred="NA"
      return res.status(200).send({status:202});
    } else {
      whoreferred="NA"
      return res.status(200).send({status:404,error:"Coupon didnt exists"});
    }
  
  
}
else{

  amountFinal = amount;
  whoreferred="NA"
}
// refCodes.includes(referer)?times%5==0?amount-150*times:amount-100*times:times%5==0?amount-50*times:amount

console.log(amountFinal)
//  if(orders[0].peoples.length%5==0){
//   if(refCodes.includes(referer)){
//     amount = amount-70;
//   }
//   else{
//     amount = amount-50;
//   }
//  }
//  else{
//   if(refCodes.includes(referer)){
//     amount = amount-20;
//   }
//   else{
//     // amount = 350;
//   }
//  }
 //orders[0].peoples.length*
 if(amountFinal!=response.data.data.transactions[index].amount){
  console.log("Amount didnt match")
  return res.status(200).send({status:403,error:"Amount didnt match"});
 }
 const payment=await PaymentModel.create({
  parent_number:parent_number,
  referer:whoreferred,
  razorpay_order_id:razorpay_order_id,
  razorpay_payment_id:razorpay_payment_id,
  razorpay_signature:razorpay_signature,
 });
 const peoples=orders[0].peoples;
 peoples.map((val,i)=>payment.tickets.push({
  name:val.name,
  number:val.number,
  college_id:val.college_id,
  ticket_number:uuidv4(),
 })
 );
 await payment.save().then((val)=>{
  console.log(val);
  res.status(200).send({status:200,ticket_id:val._id});

 });

  })

 


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
  const authUsers = ["919413465367","919079907146","918005943828","919079124770"]
  axios
  .post("https://vgthr.authlink.me", payload, { headers: headers })
  .then(async (response) => {
    console.log(response.data.statusCode === 200 && response.data.user.waNumber === mobile && response.data.user.waNumber.toString()==="919413465367")
    console.log(response.data.statusCode === 200)
    console.log(response.data.user.waNumber === mobile)
    console.log(response.data.user.waNumber.toString()==="919413465367")
    if (response.data.statusCode === 200 && response.data.user.waNumber === mobile && authUsers.includes(response.data.user.waNumber.toString())) {
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
  college_id:val.college_id,
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
export const getRewards=async(req,res)=>{
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
      var arr = []
      const persons = await PaymentModel.find({ referer: mobile })
      for(var i=0;i<persons.length;i++){
        for(var j=0;j<persons[i].tickets.length;j++){
          arr.push(persons[i].tickets[j].name)
        }
        // arr.push(persons[i].tickets[0].name)
      }
      console.log(arr)
    if (arr.length > 0) {
      // Extract the names from the persons array
      res.send({names:arr});
    } else {
      res.send({ status: 404 });
    }
      
    }
    else{
      res.send({ status: 501 });
    }
    // res.status(200).json(responseData);
  })
  .catch((err) => {
    res.send({ status: 401 });
    console.log(err);
  });


  
}