const mongoose =require("mongoose")
const express = require("express")
const morgan = require("morgan")
const pinRouter=require("./router/pin.js")
const userRouter=require("./router/user.js")
const cors =require("cors")
const dotenv = require("dotenv")
dotenv.config();


const app=express();
async function connectDB (){
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('connected to DB')
    } catch (error) {
        console.log("connection failed")
    }
}
connectDB();


app.use(cors({
    origin: "http://localhost:5173", // Yahan client ka origin set karo
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));

app.use(express.json())
app.use(morgan("common"))
app.use("/api/user",userRouter)
app.use("/api/pins",pinRouter)



const PORT=5001;
app.listen(PORT,()=>{
    console.log(`backend server is running http://localhost:${PORT}`)
})