const express = require("express");
const app = express();
const connectDB= require("./config/database"); //only after requirng this file here you will be able to connect to the db
const cookieParser=require("cookie-parser");
const cors = require("cors");
const PORT=7777;

app.use(cors({
    origin:"http://localhost:5173/",
    credentials:true
}));  //whitelisting the frontend domain
app.use(express.json()); //every json that comes from frontend will be converted to js object. this function will work on every route.
app.use(cookieParser()); 

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter= require('./routes/request.js');
const feedRouter=require('./routes/feed.js');
const userRouter = require('./routes/user.js');

app.use("/", authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",feedRouter);
app.use("/",userRouter);

connectDB()
    .then(()=>{
        console.log("DB connection was establised :D");
        app.listen(PORT,()=>{
            console.log(`server is running on port:${PORT}`);
        });
    })
    .catch((err)=>{
        console.error("couldn't connect to the database :(")
    });
