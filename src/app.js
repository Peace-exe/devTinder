const express = require("express");
const app = express();
const connectDB= require("./config/database"); //only after requirng this file here you will be able to connect to the db
const User = require("./models/user");
PORT=7777;

app.use(express.json()); //every json that comes from frontend will be converted to js object.this function will work on every route.

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

    //now it can handle incoming data from the frontend and save it in the DB hence it is now dynamic
    const user = new User(req.body);
    

    try{
        await user.save(); //saving the User instance to our DB //this function returns a promise
        res.send("data saved successfully!!");
    }catch(err){
        res.status(400).send("error occured while saving to DB "+ err.message);
    }
    

});

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

//update the user info
app.patch("/user",
    async (req,res)=>{
        const userId= req.body.userId;
        const data = req.body;
        try {

            const user = await User.findByIdAndUpdate({_id:userId},data,{
                /* options */ 
                returnDocument:"before"
            });// can also write (userId,data)
            res.send("User info updated successfully.")
        } catch (err) {
            res.status(400).send(err,"something went wrong updating the user info.");
        }
        
    }

);
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
