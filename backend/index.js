import dotenv from "dotenv";
import express from "express"
import { connectDB } from "./db/db.js";
import dns from "dns"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
dns.setServers(["1.1.1.1"]);
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth",authRouter);

const PORT = process.env.PORT ||5000;


app.listen(PORT,()=>{
 connectDB();
console.log("Connected to port 8000");
})




