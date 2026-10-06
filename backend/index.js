import dotenv from "dotenv";
import express from "express"
import { connectDB } from "./db/db.js";
import dns from "dns"
dns.setServers(["1.1.1.1"]);
dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT ||5000;


app.listen(PORT,()=>{
 connectDB();
console.log("Connected to port 8000");
})




