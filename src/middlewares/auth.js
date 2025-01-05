const JWT_PRIVATE_KEY="@DEVTINDER$730";
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const userAuth= async (req,res,next)=>{
    try {
        //read the cookie from the request
        const {token}=req.cookies;
        if(!token){
            throw new Error("token expired. try logging in again.");
        }

        //verify the token
        const payload= await jwt.verify(token , JWT_PRIVATE_KEY);
        const {_id} = payload;

        // find the user in the db 
        const userData= await User.findById(_id);
        if(!userData){
            throw new Error("user does not exist.");
        }

        req.user= userData; //attaching the user object(user data) with the request itself so that next request handler or middleware can read it. 
        next(); //call the next middleware or request handler



    } catch (err) {
        res.status(400).send("ERROR: "+ err.message);
    }
}

module.exports={
    userAuth
};