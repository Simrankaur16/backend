const express = require("express");
const app = express();
const cors = require("cors");




require("./conn/connection.js");
const user = require("./routes/user");
const book = require("./routes/book");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart")
const order = require("./routes/order")

app.use(cors());
app.use(express.json());
//routes

app.use("/api/v1", user);
app.use("/api/v1", book);
app.use("/api/v1", favourite);
app.use("/api/v1", cart);
app.use("/api/v1", order);

app.get("/", (req, res)=>{
    res.send("Hello World from backend side");
})
//creating port 
app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});