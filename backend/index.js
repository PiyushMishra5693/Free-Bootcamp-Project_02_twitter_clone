import dotenv from "dotenv";
import express from "express"
import { connectDB } from "./db/db.js";
import dns from "dns"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import {v2 as cloudinary} from "cloudinary";
dns.setServers(["1.1.1.1"]);
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
const PORT = process.env.PORT ||5000;


app.listen(PORT,()=>{
 connectDB();
console.log("Connected to port 8000");
})




