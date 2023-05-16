import mongoose from "mongoose";
const PaymentSchema=new mongoose.Schema({
    razorpay_order_id:{
        type:String,
        required:true,
    },
    razorpay_payment_id:{
        type:String,
        required:true,   
    },
    razorpay_signature:{
        type:String,
        required:true,  
    },
    amount:{
        type:String,
        // required:true,  
    },
    parent_number:{
        type:String,
        required:true
    },
    referer:{
        type:String,
        required:true
    },
    tickets:[{
        name:{
            type: String,
            // required:true
        },
        number:{
            type: String,
            // required:true,
        },
        ticket_number:{
            type:String,
            // required:true,
        }, 
    },
    
]


});
export const PaymentModel=mongoose.model("Ticket",PaymentSchema); 