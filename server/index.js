import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"
import videoRoutes from "./routes/videos.js"
import commentRoutes from "./routes/comments.js"
import authRoutes from "./routes/auths.js"
import cookieParser from "cookie-parser";
import cors from "cors";
//var cors = require('cors')
const app = express();
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("Connected to the DB");
    }).catch((err) => { throw err; });

}


app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/auths", authRoutes);


app.use((err, req, res, next) => {
    console.log("next Middleware called");
    console.dir("req=", req, "res=", res, "err=", err, "next=", next);
    const status = err.status || 500;
    const message = err.message || "something went wrong";
    return res.status(status).json({
        success: false,
        status: status,
        message: message
    })

})



app.listen(process.env.PORT || 8800, () => {
    connect()

})