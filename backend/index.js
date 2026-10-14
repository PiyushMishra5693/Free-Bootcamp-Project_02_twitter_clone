import dotenv from "dotenv";
import express from "express"
import { connectDB } from "./db/db.js";
import dns from "dns"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js"
import notificationRouter from "./routes/notification.route.js"
import {v2 as cloudinary} from "cloudinary";
import path from "path";
dns.setServers(["1.1.1.1"]);
dotenv.config();

const app = express();

app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})
app.use("/api/auth",authRouter);
app.use("/api/users",userRouter);
app.use("/api/posts",postRouter);
app.use("/api/notifications",notificationRouter);
const PORT = process.env.PORT ||5000;


console.log(process.env.NODE_ENV);
const __dirname = path.resolve();
if(process.env.NODE_ENV==="production"){

    app.use(express.static(path.join(__dirname,"/frontend/dist")))
    app.get("/{*splat}",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })
}
app.listen(PORT,()=>{
 connectDB();
console.log(`Connected to port ${PORT}`);
})




