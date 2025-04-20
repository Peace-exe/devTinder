const express = require('express');
const {userAuth} = require('../middlewares/auth');
const User= require('../models/user');


const profileRouter = express.Router();

//profile API : validates the token inside the cookie then sends user data to the client side(using auth middleware) 
profileRouter.get("/profile/view",
    userAuth,
    async (req,res)=>{

        try {
            
            const {_id,firstName,lastName,email,photoURL,about,skills,createdAt}= req.user;//getting the relevant info only.
            
            const userData = {_id,firstName,lastName,email,photoURL,about,skills,createdAt};

            res.send(userData);
        } catch (err) {
            res.status(400).send("something went wrong \nERROR: " + err.message);
        }

    }
);

//edit user info
profileRouter.patch("/profile/edit",userAuth,
    async (req,res)=>{
        const userId= req.user?._id;
        const newData = req.body;
        ALLOWED_UPDATES=[
            
            "age",
            "gender",
            "photoURL",
            "about",
            "skills"
        ];

        try {
            /*in below line, Object.keys(data) returns an array of keys present the js object(stored in data) then that array is compared with 
             * ALLOWED_UPDATES array. lets break it down
                const dataArray=Object.keys(data);
                const isUpdateAllowed= dataArray.every(k => ALLOWED_UPDATES.includes(k));

                every() function works on arrays, takes a callback to check if each element in the array pass that check.
             */
            const isUpdateAllowed= Object.keys(newData).every(k => ALLOWED_UPDATES.includes(k));

            if(!isUpdateAllowed){
                throw new Error("update not allowed.");
            }

            if(newData?.skills.length<10){

                if(newData?.skills.every((skill)=>( skill.length>20 ))){
                    throw new Error("skills cannot exceed 20 characters.");
                }
            }
            else{
                throw new Error("Can't include skills more than 10.");
            }


            const user = await User.findByIdAndUpdate({_id:userId},newData,{
                /* options */ 
                returnDocument:"before",
                runValidators:true
            });// can also write (userId,data)
            res.send("User info updated successfully.")
        } catch (err) {
            res.status(400).send(err,"something went wrong updating the user info.");
        }

    }
)

//forgot password api
profileRouter.patch("/profile/forgotPassword",userAuth,
    (req,res)=>{
        
    }
)
//delete the user from the DB
profileRouter.delete("/user",
    async (req,res)=> {
        const userId= req.body.userId;

        try {
            const user = await User.findByIdAndDelete({_id:userId});//we can also write {userId}
            res.send("User deleted succesfully.");
            
        } catch (err) {
            res.status(400).send("something went wrong while deleting the user.");
        }
    }

);



//update the user info
profileRouter.patch("/user/:userId",
    async (req,res)=>{
        const userId= req.params?.userId;
        const data = req.body;
        ALLOWED_UPDATES=[
            
            "age",
            "gender",
            "photoURL",
            "about",
            "skills"
        ]
        try {
            /*in below line, Object.keys(data) returns an array of keys present the js object(stored in data) then that array is compared with 
             * ALLOWED_UPDATES array. lets break it down
                const dataArray=Object.keys(data);
                const isUpdateAllowed= dataArray.every(k => ALLOWED_UPDATES.includes(k));

                every() function works on arrays, takes a callback to check if each element in the array pass that check.
             */
            const isUpdateAllowed= Object.keys(data).every(k => ALLOWED_UPDATES.includes(k));

            if(!isUpdateAllowed){
                throw new Error("update not allowed.");
            }

            if(data?.skills.length<10){

                if(data?.skills.every((skill)=>( skill.length>20 ))){
                    throw new Error("skills cannot exceed 20 characters.");
                }
            }
            else{
                throw new Error("Can't include skills more than 10.");
            }


            const user = await User.findByIdAndUpdate({_id:userId},data,{
                /* options */ 
                returnDocument:"before",
                runValidators:true
            });// can also write (userId,data)
            res.send("User info updated successfully.")
        } catch (err) {
            res.status(400).send(err,"something went wrong updating the user info.");
        }
        
    }

);

module.exports= profileRouter;