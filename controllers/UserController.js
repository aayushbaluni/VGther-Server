import mongoose  from "mongoose"
import {UserModel} from "../models/UserModel.js"
 export  const register=async(req,res)=>{
    const {name,number}=req.body;
    const result=await UserModel.find({number:number});
    if(result.length!=0){
        console.log("ALready exists");
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
    const result=await UserModel.find({number:number});
    if(result.length==0){console.log("Not Presend");return res.status(401).send([]); }
    console.log(result);
     res.send(result);
}   