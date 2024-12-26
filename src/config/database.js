const mongoose = require('mongoose');

URI = "mongodb+srv://amanyadav2303:U9oEvsW1NdAJB8er@namastenode1.tudbf.mongodb.net/NamasteNode1";


const connectDB = async () => {
    await mongoose.connect(URI);
};

module.exports=connectDB;





    