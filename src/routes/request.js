const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const requestRouter = express.Router();

//sending the connection request
requestRouter.post("/request/send/:status/:toUserId",userAuth,
    async (req,res)=>{

        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;

            //**the corner case of fromUserId == toUserId(sending request to oneself) is being handled by schema through a pre middleware**

            //checks if the valid status type is passed.
            const allowedStatus = ["interested","ignored"];

            if (!allowedStatus.includes(status)){
                return res.status(400)
                .json({
                    message:"invalid status type:" + status
                });
            }

            //checks if the user's connection request is being to sent to a existing user.
            const toUserExist = await User.findById(toUserId);

            if(!toUserExist){
                return res.status(404).json({message:"user you're trying to connect does not exist."});
            }

            //this checks if one of the conditions are true($or) : either request userA -> userB exist or request userB -> userA exist. 
            const existingConnectionRequest = await ConnectionRequest.findOne({
                $or :[
                    {fromUserId,toUserId},
                    {fromUserId:toUserId, toUserId:fromUserId}
                ]
            });

            if(existingConnectionRequest){
                return res.status(400).json({message:"request already exists."});
            }

            const connectionRequest = new ConnectionRequest({
                fromUserId,
                toUserId,
                status
            });

            const data=await connectionRequest.save();

            res.json({
                message:"connection request sent successfully.",
                data

            });
        } catch (err) {
            res.status(400).send("ERROR: "+err.message);
        }

        
        
    }
);

//reviewing the connection request
requestRouter.post("/request/review/:status/:requestId",
    userAuth,
    async (req,res)=>{

        const loggedInUser = req.user;
        const {status,requestId}= req.params;

        try {
            //validating status
            const allowedStatusValues= ["accepted","rejected"];

            if(!allowedStatusValues.includes(status)){
                return res.status(400).json({message:"invalid status type"});
            }

            //fetching the request data from DB. only fetching requests with "interested"(pending) status. userB==loggedInUser

            const connectionRequest  = await ConnectionRequest.findOne({
                _id:requestId,
                toUserId:loggedInUser._id,
                status:"interested"

            });
            if(!connectionRequest){
                return res.status(404).json({message:"request not found"});
            }

            //assigning new status(accepted/rejected) in the request doc
            connectionRequest.status = status;
            //saving it to the db.
            const savedData=await connectionRequest.save();
            res.json({
                message:"request "+ status,
                savedData
            });

        } catch (err) {
            res.status(400).json({
                message:"ERROR occured",
                errorMsg:err.message
            });
            
        }
    }

);

module.exports= requestRouter;

