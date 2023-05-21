import mongoose  from "mongoose"
import {UserModel} from "../models/UserModel.js"
import {CoupomModel} from "../models/CouponModel.js"
import {PaymentModel} from "../models/PaymentModel.js"
import axios from "axios";
 export  const register=async(req,res)=>{
    const {name,number}=req.body;
    const result=await UserModel.find({number:number});
    if(result.length!=0){
        console.log("Already exists");
        console.log(result);
        res.status(200).send("Number Already Exists.")
    }
    else{
        const user=new UserModel({name:name,number:number});
        await user.save().then((val)=>{
            console.log(val);
            res.status(200).send("Done")
        })
    }
}

export const login=async(req,res)=>{
    const {number}=req.body;
    const result=await CoupomModel.find({number:number});
    if(result.length==0){console.log("Not Present");return res.status(401).send([]); }
    console.log(result);
    res.send(result);
}

export const coupon=async(req,res)=>{
    try {
        const { code } = req.body;
        var mobileno = `91${code}`
        const parentNumberExists = await PaymentModel.exists({ parent_number: mobileno });

    // Counting the number of documents with the given number at the referer field
    // const refererCount = await PaymentModel.countDocuments({ referer: mobileno });
    var arr = []
      const persons = await PaymentModel.find({ referer: mobileno })
      for(var i=0;i<persons.length;i++){
        for(var j=0;j<persons[i].tickets.length;j++){
          arr.push(persons[i].tickets[j].name)
        }
      }

    if (parentNumberExists && arr.length < 10) {
      return res.status(200).send({status:200});
    } else if (arr.length >= 10) {
      return res.status(200).send({status:202});
    } else {
      return res.status(200).send({status:404,error:"Coupon didnt exists"});
    }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ status:500,error: 'Server error' });
      }
}





export const message=async(req,res)=>{
    const {name,email,message}=req.body;
    axios.post(
        'https://docs.google.com/forms/u/0/d/e/1FAIpQLSeGw0E2hrFhR5ZS5996K5CExzlam92dOakJJ2Oy_IpatitCuQ/formResponse',
        new URLSearchParams({
            'entry.680841069': name,
            'entry.1287125713': email,
            'entry.373054253': message
        })
    ).then(response=>{
      if(response.status!==200){
        return res.status(401).send([]);
      }
      else{
        res.status(200).send("ok");
      }
    })
}   