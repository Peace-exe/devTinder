const express = require('express');
const User = require('../models/user');
const feedRouter= express.Router();
const userAuth = require('../middlewares/auth');


//feed API: to fetch all the users from the DB 
feedRouter.get("/feed",userAuth,
    async (req,res)=>{
        
        const loggedInUser = req.user;

        try{

            const users = await User.find({});
            res.send(users);

        }catch(err){
            res.status(400).send("something went wrong :(");
        }

    }
);

module.exports= feedRouter;