const router = require("express").Router();  // routes separately form the main application 
const User = require("../models/user.js");
//sign up 

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {authToken} = require("./userAuth")

router.post("/signup", async(req, res) => {

    try {
          const {username, email, password, address} = req.body;
          //checking userlength length is more than 4

          if(username.length < 4)
          {
            return res.status(400)
             .json("Username should be more than 3 characters");
          }
        // check user name already exist 

        const extUername = await User.findOne({
                    username:username
        }
        );
        if(extUername) {
            return res.status(400)
            .json("Username already exist");
        }

        const extemail = await User.findOne({
            email:email
         });
        if(extemail) {
            return res.status(400)
            .json("Email already exist");
        }

        //check passoword length
        if(password.length <= 6)
        {
            return res.status(400)
            .json("Password should be more than 6 characters");
        }

        const hasPass = await bcrypt.hashSync(password, 10)
        
        const newUser = new User ({username:username, email:email, password:hasPass, address:address});
        await newUser.save();
        return res.status(200).json("User created successfully");

    }
    
    catch (error )
    {
        res.status(500).json("Internal Server Error");
    }

});


//sign in 


router.post("/sign-in", async(req, res) => {

    try {
          
        const {username, password} = req.body;

        const extUser = await User.findOne({
            username

        });

        if(!extUser)
        {
            res.status(400).json("User not found");
            return;
        }
        

        await bcrypt.compare(password, extUser.password, (err,data)=>{
            if(data)
            {
                const authClaims = [
                    {name:extUser.username, role:extUser.role}
                ];
                const token = jwt.sign({authClaims }, "bookstore123", {expiresIn: "30d",});
            
                res.status(200).json({result:true, message: "login Successful", id:extUser._id, role :extUser.role, token:token});
            }else {
                res.status(400).json("Invalid credentials");
            }
        })

    }
    
    catch (error )
    {
        res.status(500).json("Internal Server Error");
    }

});


router.get('/getUserInfo', authToken, async (req, res)=>{
    try{
      const {id} = req.headers;
      const data = await User.findById(id).select("-password");
      return res.status(200).json(data);
    }
    catch(error){
        res.status(500).json("Internal Server Error")
    }
})


router.put("/updateAdd", authToken, async (req, res)=>{
    try{
         const { id} = req.headers;
         const {address} = req.body;
         await User.findByIdAndUpdate(id, {address: address});
         res.status(200).json({messagae : "Address updated successfully"});
    }
    catch {
        res.status(500).json({message: "Internal server error"});
    }
})



module.exports = router;
