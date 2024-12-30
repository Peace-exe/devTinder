const mongoose=require('mongoose');

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
        trim:true
    },
    
    password:{
        type:String,
        required:true
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
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2TgOv9CMmsUzYKCcLGWPvqcpUk6HXp2mnww&s"
    },
    about:{
        type:String,
        default:"this is a default user about"
    },
    skills:{
        type:[String],
        validate(arr){
            if(arr.length<10){

                if(arr.every((skill)=>( skill.length>20 ))){
                    throw new Error("skills cannot exceed 20 characters.");
                }
            }
            else{
                throw new Error("Can't include skills more than 10.");
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