const express = require("express");
const {validateSignUpData}= require('../utils/helperValidator');
const bcrypt= require('bcrypt');
const User = require("../models/user");
const validator= require('validator');

const authRouter = express.Router();

authRouter.post("/signup", async (req,res)=>{ 

    //creating a new instance of the User model
    /* //hardcoding the data
    const user = new User({
        "firstName":"arun",
        "lastName" : "yadav",
        "gender":"male",
        "email":"arun26977@gmail.com",
        "password":"ay123#"
    }); 
    */

    
    

    try{
        //1.validation of user data
        validateSignUpData(req);
        const {firstName,lastName,email,password}=req.body;

        //2.encrypting password
        const passwordHash= await bcrypt.hash(password,10);

        //3.creating the new instance of the model
        //now it can handle incoming data from the frontend and save it in the DB hence it is now dynamic


        //const user = new User(req.body);
        const user = new User({
            firstName,
            lastName,
            email,
            password:passwordHash

        });
        await user.save(); //saving the User instance to our DB //this function returns a promise
        res.send("data saved successfully!!");
    }catch(err){
        res.status(400).send("error occured while saving to DB.\n ERROR: "+ err.message);
    }
    

});

authRouter.post("/login",
    async (req,res)=>{

        try{
            
            const {email,password}= req.body;

            if(!validator.isEmail(email)){
                throw new Error("Invalid Credentials");
            }
            else{
                const userData = await User.findOne({email:email}); //logged in user
                
                if(!userData){
                    throw new Error("Invalid Credentials");
                }

                const isPasswordValid = await userData.validatePassword(password);

                if(!isPasswordValid){
                    throw new Error("Invalid credentials");
                }
                else{
                    //create a jwt token 
                    const token= await userData.getJWT();

                    res.cookie("token",token, {
                        expires:new Date(Date.now()+24*3600000)
                    });
                    
                    const {_id,firstName,lastName,email,photoURL,about,skills,createdAt}= userData;
                    const relevantUserInfo = {_id,firstName,lastName,email,photoURL,about,skills,createdAt}
                    
                    res.send(relevantUserInfo);
                    
                }

                /*
                bcrypt.compare(password, userData.password, async (err, result)=> {
                    if(!result){
                        throw new Error("Invalid credentials");
                    }
                    else{
                        //create a jwt token 
                        const token= await userData.getJWT();

                        res.cookie("token",token, {
                            expires:new Date(Date.now()+24*3600000)
                        });
                        res.send("login successful.");
                        console.log(res);
                    }
                });
                */
            }
        }catch(err){
            res.status(400).send("Invalid Credentials");
        }
        

});

authRouter.post("/logout",
    (req,res)=>{
        res
        .cookie("token",null,{
            expires:new Date(Date.now())
        })
        .send("logout successful");
    }
)

module.exports=authRouter;
