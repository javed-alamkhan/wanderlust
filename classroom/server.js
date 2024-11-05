const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path =  require("path");

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions= {
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized : true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next) => {
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
    next();
})

app.get("/register" , (req,res) => {
    let {name = "anonymous"} = req.query;
    req.session.name = name;
    if (name==="anonymous"){
        req.flash("error" , "user not registerd");
    }else{
        req.flash("success" , "user registered successfully");
    }
 res.redirect("/hello");
})

app.get("/hello" , (req,res) => {
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
     res.render("page.ejs" , {name :req.session.name });
})











app.listen(3000,()=>{
    console.log("server is listening to 3000");
});