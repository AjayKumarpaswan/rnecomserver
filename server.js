 import express from "express";
import colors from "colors"
import morgan from "morgan";
import cors from "cors"
import dotenv from "dotenv"
 import cookieParser from "cookie-parser";
import connectDb from "./config/db.js";
import cloudinary from "cloudinary"

import Stripe from "stripe"
import helmet from "helmet"
import mongoSanitize from "express-mongo-sanitize"
//dot env config
 dotenv.config()

//db connection
connectDb()
//stripe configuration
export const stripe=new Stripe(process.env.STRIPE_API_SECRET);
 
//cloudinary config
cloudinary.v2.config({
cloud_name:process.env.CLOUDINARY_NAME,
api_key:process.env.CLOUDINARY_API_KEY,
api_secret:process.env.CLOUDINARY_SECRET,
});
//rest object
const app=express();

//middleware
app.use(helmet())
app.use(mongoSanitize())
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())
app.use(cookieParser())
 //route
 //routes setup
import testRoutes from "./routes/testRoutes.js"
app.use("/api/v1",testRoutes);
//for register routes
import userRoutes from "./routes/userRoutes.js"
app.use("/api/v1/user",userRoutes)

//for product routes
import productRoutes from "./routes/productRoutes.js"
app.use("/api/v1/product",productRoutes)


//for category routes
import categoryRoutes from "./routes/categoryRoutes.js"
app.use("/api/v1/cat",categoryRoutes)

//for order routes
import orderRoutes from "./routes/orderRoutes.js"
app.use("/api/v1/order",orderRoutes)
 app.get("/",(req,res)=>{
    return res.status(200).send("Welcome to node server")
})

//port
const PORT=process.env.PORT || 8000;

//listen
app.listen(PORT,()=>{
console.log(`Server Running  on port ${process.env.PORT} on ${process.env.NODE_ENV} mode`.bgRed);
})