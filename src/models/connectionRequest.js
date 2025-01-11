const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required : true,

    },
    toUserId:{
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status :{
        type : String,
        required : true,
        enum : {
            values : ["ignored","interested","accepted","rejected"],
            message : `{VALUE} is incorrect status type`
        }
    }

}, {timestamps:true});

connectionRequestSchema.pre("save", function (next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("you cannot send a connection request to yourself.");
    }

    next();

})

//compound index. 1 stands for ascending order
connectionRequestSchema.index({fromUserId:1, toUserId:1}); 

const ConnectionRequestModel = new mongoose.model("connectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;