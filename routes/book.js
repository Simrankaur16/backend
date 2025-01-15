const router = require("express").Router();  // routes separately form the main application 
const User = require("../models/user.js");
const Book = require ("../models/book")
//sign up 

const jwt = require("jsonwebtoken");

const {authToken} = require("./userAuth");
const book = require("../models/book");


//add book  adimin role

router.post("/add-book", authToken, async(req, res)=>{
    try {
        const {id} = req.headers;
       const user = await User.findById(id);
       if(user.role !== "admin")
       {
       return res.status(400).json({message: "Access Failed"})
       }

        const book = new Book ({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            description: req.body.description, 
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({message: "Book added successfully"})

    }
    catch(error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"})
    }
})


router.put("/update-book", authToken, async(req, res)=>{
    try {
        const{bookid} = req.headers;
        await book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            description: req.body.desc, 
            language: req.body.language,
        });

        return res.status(200).json({
            message: "Book updated successfully"
        })

    }
    catch(err) {
               console.log(err);
               return res.status(500).json({message: "Update failed"})
    }
})


router.delete('/deleteBook', async(req, res)=>{
    try {
       const {bookid} = req.headers;
       await Book.findByIdAndDelete(bookid);
       return res.status(200).json({message: "Book deleted successfully"});


    }catch(error) {
            return res.status(500).json({message: "An error occurred"});
    }
})



router.get("/getAllBooks", async(req, res)=>{
    try{
        const book = await Book.find().sort({createdAt: -1});
        return res.json({
            status: "Success",
            data: book,

        });

    }catch {
        return res.status(500).json({message: "An error occured"});
    }
});

//getting recently added book limit to 4

router.get("/getRecentBooks", async(req, res)=>{
    try{
        const book = await Book.find().sort({createdAt: -1}).limit(4);
        return res.json({
            status: "Success",
            data: book,

        });

    }catch {
        return res.status(500).json({message: "An error occured"});
    }
});

//getting book by id

router.get("/getBookById/:id", async(req,res)=>{
    try {
        const {id} = req.params;
        const book = await Book.findById(id);

        return res.json({status: "success", data: book,});

    } catch(error){
        return res.status(500).json({message: "An erorr occured"})
    }
});





module.exports = router;
