const mongoose = require("mongoose");

const conn = async() =>{
    try {
        await mongoose.connect("mongodb+srv://bsa:sim@cluster0.y1rem.mongodb.net/Bookstore");
        console.log("Connected to DB");
    } catch(error){
        console.log(error);
    }

};

conn();
