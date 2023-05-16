import mongoose  from "mongoose"
import {UserModel} from "../models/UserModel.js"
import {CoupomModel} from "../models/CouponModel.js"
import axios from "axios";
 export  const register=async(req,res)=>{
    const {name,number}=req.body;
    const result=await UserModel.find({number:number});
    if(result.length!=0){
        console.log("Already exists");
        console.log(result);
        res.status(401).send("Number Already Exists.")
    }
    else{
        const user=new UserModel({name:name,number:number});
        await user.save().then((val)=>{
            console.log(val);
            res.send(val);
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
        const coupon = await Coupon.findOne({ code });
        
        if (coupon) {
          res.json({ discountAmount: coupon.discountAmount });
        } else {
          res.status(404).json({ message: 'Coupon code not found' });
        }
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
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