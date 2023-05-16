import mongoose from "mongoose";


const CouponSchema=new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discountAmount: {
    type: Number,
    required: true,
  },
});

export const CoupomModel=mongoose.model("Coupon",CouponSchema);