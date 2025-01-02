const mongoose=require('mongoose');
const validator= require('validator')

const userSchema = new mongoose.Schema({ //"new" keyword is not mandatory there
    firstName:{
        type:String,
        required:true,
        minLength:1,
        maxLenght:50

    },
    lastName:{
        type:String,
        required:true,
        minLength:1,
        maxLenght:50
    },
    email:{
        type:String,
        required:true,
        minLength:1,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email format: "+value);
            }
        }
    },
    
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password."+
                    "Password must contain minimum 8 characters,1 lowercase ,1 uppercase and 1 special character");
            }
        }
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("Enter a valid gender.");
            }
        }
    },
    photoURL:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("invalid URL: "+value);
            }
        }
    },
    about:{
        type:String,
        default:"this is a default user about"
    },
    skills:{
        type:[String],
        
        validate:{
            validator(arr){
                if(arr.length>10){
                    throw new Error("skills cannot be more than 10.")
                }
                else if(arr.some((skill)=>(skill.length>20))){
                    throw new Error("skills cannot exceed 20 characters.");
                }
                else{
                    return true; //validation passed
                }
            }
        }
        
        
    }

},
{
    timestamps:true
}
);

const User = mongoose.model("User",userSchema);


module.exports=User;