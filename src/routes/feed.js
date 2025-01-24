const express= require('express');
const ConnectionRequestModel = require('../models/connectionRequest');
const User = require('../models/user');
const { userAuth }= require('../middlewares/auth');

const feedRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender photoURL skills about";

feedRouter.get("/feed",userAuth,
    async (req,res)=>{

        const loggedInUser= req.user;

        //pagination : we are sending 10 pages at a time.
        const page = req.query.page || 1;
        let limit = req.query.limit || 10;
        limit = limit>50 ? 50 : limit;
        const skip = (page-1)*limit; //formula for skip. (refer notes for explaination.)

        try {
            
            //finding all the connection requests which user has sent and have received.
            const connectionRequest = await ConnectionRequestModel.find({
                $or : [
                    {fromUserId : loggedInUser._id},
                    {toUserId : loggedInUser._id}
                ]
            });

            const hiddenUsers = new Set(); // initialising a set data structure

            // pushing the user id's to the set. duplicates will be ignored (property of a set). 
            // the set will also contain the _id of loggedInUser
            connectionRequest.forEach(req => {
                hiddenUsers.add(req.fromUserId.toString());
                hiddenUsers.add(req.toUserId.toString());
            });
            hiddenUsers.add(loggedInUser._id.toString()); // adding the id of the loggen in user.

            const visibleUsers = await User.find({
                _id: { $nin : Array.from(hiddenUsers) }
            }).select(USER_SAFE_DATA).skip(skip).limit(limit);

            res.json({feedData: visibleUsers});



        } catch (err) {
            res.status(400).json({message : "ERROR: "+ err.message});
        }

        res.send(loggedInUser);

});

module.exports=feedRouter;