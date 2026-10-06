import mongoose from "mongoose";


export const connectDB = async()=>{

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb Connected");
    } catch (error) {
        console.log(error.message);
    }
}