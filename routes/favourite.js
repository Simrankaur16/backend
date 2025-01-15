const router = require("express").Router();
const User = require("../models/user");
const {authToken} = require("./userAuth");

//adding book to favorite

router.put("/addBookFav", authToken, async(req,res)=>{

    try {
            const {bookid, id} = req.headers;
            const userData = await User.findById(id);
            const ifBookFav = userData.favourites.includes(bookid);
            if(ifBookFav){
                return res.status(200).json({message: "Book is already in favrotes"});
            }
            await User.findByIdAndUpdate(id, {$push: {favourites: bookid}});
            return res.status(200).json({message: "Book is added in favrotes"});
    }catch(error) {
        res.status(500).json({message: "Internal server error"});
    }

})



router.put("/remBookFav", authToken, async(req,res)=>{

    try {
            const {bookid, id} = req.headers;
            const userData = await User.findById(id);
            const ifBookFav = userData.favourites.includes(bookid);
            if(ifBookFav){
                await User.findByIdAndUpdate(id, {$pull: {favourites: bookid}});

            }
            return res.status(200).json({message: "Book reomed form  favrotes"});
    }catch(error) {
        res.status(500).json({message: "Internal server error"});
    }

})

//get favourite book 
router.get("/getFavBook", authToken, async (req, res)=>
{
    try {
        const {id} = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favourites = userData.favourites.reverse();
        return res.json({
                status: "Sucess",
                data: favourites,
        })

    }catch(error)
    {
      return  res.status(500).json({message: "An error occured"});
    }
});


module.exports = router;