require('dotenv').config();
// console.log(process.env);

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


/////////////////Mongoose Schema and Models////////////////////

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


// console.log(process.env.SECRET);
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']} );



const User = new mongoose.model("User", userSchema);

/////////////////Render Home, Loging and Register Page////////////////////

app.get("/", function(req, res){
    res.render("home");
})


app.get("/login", function(req, res){
    res.render("login");
})

app.get("/register", function(req, res){
    res.render("register");
})

/////////////////POST Request////////////////////

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save()
    .then(function(user){
        console.log(user);
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    });
})

app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then(function(foundUser){
        // console.log(foundUser);
        if (foundUser){
            // console.log("Found");
            if(foundUser.password === password){
                res.render("secrets")
            }
            
        }else{
            // console.log("Not found");
            res.send("You have not yet registered an account!")
        }
        // res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    })
});



app.listen(3000,function(){
    console.log("Server started on port 3000.")
})