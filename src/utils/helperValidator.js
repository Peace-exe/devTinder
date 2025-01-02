const validator = require('validator');

const validateSignUpData = (req)=>{
    const {firstName,lastName,email,password}= req.body;

    if(!firstName||!lastName){
        throw new Error("Both first and last name is required.");
    } else if (!validator.isEmail(email)){
        throw new Error("invalid email address.");
    } else if (!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password."+
                    "Password must contain minimum 8 characters,1 lowercase ,1 uppercase and 1 special character");
    }
}

module.exports={
    validateSignUpData
};