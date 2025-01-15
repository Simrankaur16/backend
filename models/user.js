const mongoose = require("mongoose");

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
        
    },
    email : {
        type : String, 
        require : true,
        unique : true
    },
    password: {
          type: String, 
          require: true
    },
    address: {
        type: String,
        requie: true
    },
    avatar: {
        type: String,
        default:  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small_2x/default-avatar-icon-of-social-media-user-vector.jpg"
    },
    role: {
        type: String, 
        default : "user",
        enum: ["user", "admin"]
    },
    favourites: [
        {
            type:mongoose.Types.ObjectId, 
            ref:"books"
        }
    ],

    cart: [
        {
            type: mongoose.Types.ObjectId,
            ref: "books"
        }
    ],
    orders: [
        {
            type: mongoose.Types.ObjectId,
            ref: "order"
        }
    ],


},
{timestamps: true}

);
module.exports = mongoose.model("users", user);