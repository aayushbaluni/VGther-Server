import mongoose  from "mongoose";

export const connectDB=async()=>{
   await mongoose.connect('mongodb+srv://vghter:f1Rzsql566XrA3yQ@cluster0.ysjjrub.mongodb.net/?retryWrites=true&w=majority',{

   useNewUrlParser: true, 
   
   useUnifiedTopology: true 
   
   }).then(()=>
    console.log(`Mongodb is connected `)
  )
}   