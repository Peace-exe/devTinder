const express = require("express");
const app = express();
const connectDB= require("./config/database"); //only after requirng this file here you will be able to connect to the db
const User = require("./models/user");
const {validateSignUpData}= require('./utils/helperValidator');
const bcrypt= require('bcrypt');
const validator= require('validator');
const cookieParser=require("cookie-parser");
const jwt=require("jsonwebtoken");
const {userAuth}= require("./middlewares/auth");
const PORT=7777;
const JWTPRIVATEKEY="@DEVTINDER$730";

app.post("/signup", async (req,res)=>{ 

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


//login API
app.post("/login",
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
                    res.send("login successful.");
                    
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

//profile API : validates the token inside the cookie then sends user data to the client side(using auth middleware) 
app.get("/profile",
    userAuth,
    async (req,res)=>{

        try {
            
            const userData= req.user;

            res.send(userData);
        } catch (err) {
            res.status(400).send("something went wrong \nERROR: " + err.message);
        }

    }
);

//delete the user from the DB
app.delete("/user",
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

//get api: to fetch users by email
app.get("/user", 
    async (req,res)=>{
        const userEmail = req.body.emailId;
        
        try{
            //findOne() will return only the first user it finds with that userEmail while find() can return more than one user in the same case
            const users = await User.findOne({ email : userEmail }); 

            if(users.length===0){
                res.status(400).send("User not found");
            }
            else{
                res.send(users);
            }
        }catch(err){
            res.status(400).send("something went wrong :(");
        }
    
    }
);

app.post("/sendConnectionReq",userAuth,
    (req,res)=>{
        const user= req.user;
        res.send(user.firstName+" sent a request!");
    }
);

//feed API: to fetch all the users from the DB 
app.get("/feed",
    async (req,res)=>{

        try{

            const users = await User.find({});
            res.send(users);

        }catch(err){
            res.status(400).send("something went wrong :(");
        }

    }
);