import mongoose from 'mongoose'
const Users=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    number:{
        type:Number,
        required:true,
    }
});


export const UserModel=mongoose.model("Users",Users);