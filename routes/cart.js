const router = require("express").Router();
const user = require("../models/user");
const {authToken} = require("./userAuth");

router.put("/addToCart", authToken, async(req, res)=>{
    try {
        const{bookid, id} = req.headers;
        const userData = await user.findById(id);
        const iscart = userData.cart.includes(bookid);
        if(iscart){
            return res.json({
                status: "Success",
                message: "Book in Already in cart"
            })
            
        }
        else{
            await user.findByIdAndUpdate(id, {$push: {cart: bookid}});
            return res.json({
              status: "Success",
              message: "book Added in cart",
            })
        }
    }catch(error){
        res.status(500).json({message: "An error occurred"})
    }
})


router.put("/remBookCart/:bookid", authToken, async(req, res)=>{
    try {
    const {bookid} = req.params;
    const {id} = req.headers;
     await user.findByIdAndUpdate(id,  {$pull: {cart :bookid}});
    
    return res.status(200).json({message: "Book is removed for  the car"});
}catch {
    res.status(500).json({message: "Error occurred"})
}
})


router.get("/getUserCart", authToken, async(req, res)=>{
    try {
        const {id} = req.headers;
        const userData = await user.findById(id).populate("cart");
        const cart = userData.cart.reverse();

        return res.json({status: "Success",
            data: cart,
        }
        );


    } catch (error) {
        return res.status(500).json({message: "An error occurred"});
    }
})

module.exports = router;

