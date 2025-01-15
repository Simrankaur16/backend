const {authToken} = require("./userAuth");
const Book = require("../models/book");
const User = require("../models/user");
const Order = require("../models/order");

const router = require("express").Router();

//order place
router.post("/placeOrder", authToken, async(req, res)=>{
    try {
        const {id} = req.headers;
        const {order} = req.body;

        for(const orderData of order){
            //here we creating a new order
            const newOrder = new Order({user: id, book: orderData.bookid});
            const orderDataDb = await newOrder.save();

            //our new order is created now updatding the users order
            await User.findByIdAndUpdate(id, {$push: {orders: orderDataDb._id }});

            //cleaning cart
            await User.findByIdAndUpdate(id, {$pull: {cart: orderData._bookid}})

    
        }
        return res.json({status: "Success",message: "Order Placed successfully"});

    }catch(error)
    {
        return res.status(500).json({message: "An error occurred"})
    }
})


router.get("/getOrderHis", authToken, async(req, res)=>{

    try
    {
        const {id} = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: {path: "book"},
        });
        const orderData = userData.orders.reverse();

        return res.json({status: "Success", data: orderData});

    }
    catch(error)
    {
        return res.status(500).json({message: "An Error Occurred"});        
    }

})


// get order data for admin

router.get("/getAllOrdes", authToken, async(req, res)=>{
    try {
        const userData = await Order.find()
        .populate({

            path: "book",
        })
        .populate({
            path: "user"
        })
        .sort ({createdAt: -1});
        return res.json({status: "Success",
            data: userData }
        );
    }
    catch(error)
    {
        res.status(500).json({message: "An Error Occurred"})
    }
})
                         

//admin update the order

router.put("/updateOrderStatus/:id", authToken, async(req,res)=>{
    try {
    const {id} = req.params;
    await Order.findByIdAndUpdate(id, {status: req.body.staus})
    return res.json({status: "Success", message: "Status is added sccessfully"});

} catch(error){
    return res.status(500).json({message: "An error Occurred"});
}

})



module.exports = router;





