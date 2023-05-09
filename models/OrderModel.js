import mongoose from "mongoose";


const OrderSchema=new mongoose.Schema({
    order_id:{
        type:String,
        required:true,
    },
    peoples:[{
        name:{
            type:String,
            
        },
        number:{
            type:String,
        }
    }]
})

export const OrderModel=mongoose.model("Orders",OrderSchema);