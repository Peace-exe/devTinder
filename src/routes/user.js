const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

//to get all the pending connection requests of the logged in user.
userRouter.get("/user/requests/received",userAuth,
    async (req,res)=>{
        
        const loggedInUserId = req.user._id;

        try {
            const pendingRequests = await ConnectionRequestModel.find({
                toUserId : loggedInUserId,
                status : "interested"
            }).populate("fromUserId",["firstName","lastName","photoURL","gender","age"]); //instead of passing an array we can also write it like this "firstName lastName photoURL gender age".

            res.json({
                message:"requests fetched successfully.",
                data : pendingRequests
            });
        } catch (err) {
            res.status(400).json({message:err.message})
        }
        


    }
);

userRouter.get("/user/connections",userAuth,
    async (req,res)=>{

        const loggedInUser = req.user;
        const USER_SAFE_DATA = "firstName lastName photoURL gender age";

        try {
            /*
            const connections = await ConnectionRequestModel.find({
                status : "accepted",
                $or:[
                    {fromUserId : loggedInUser._id},
                    {toUserId : loggedInUser._id}
                ]
                
            });
            */
            
            const connections = await ConnectionRequestModel.find({
                $or:[
                    {fromUserId : loggedInUser._id, status:"accepted"},
                    {toUserId : loggedInUser._id,status:"accepted"}
                ],
                
            }).populate("fromUserId",USER_SAFE_DATA)
            .populate("toUserId",USER_SAFE_DATA);

            const data = connections.map((row)=>{
                if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
                    return row.toUserId;
                }
                return row.fromUserId;
            });
            

        } catch (err) {
            res.status(400).json({message:err.message})
        }
    }
);