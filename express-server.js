var express = require("express");
var path = require("path");
var app = express();
var pathReader = require("./pathReader");
var session = require('express-session');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended : true}));
app.use(
    session({secret : "secret-session"})
);

// var secondMiddleware = function(req,res,next){
//     console.log("client request at  : " + Date.now());
//     console.log("url : " + req.originalUrl);
//     if(req.session.username){
//         console.log("session_username {logged_in} : " + req.session.username);
//     }else{
//         console.log("session_username {logged_out} : " + req.session.username);
//     }
//     next();
// }

// app.use(secondMiddleware);

// login-POST
app.post("/login",function(req,res){
    req.session.username = req.body.username;
    res.send("login OK");
});


var authMiddleware = function(req,res,next){
    console.log("accessing authMiddleware at : " + req.originalUrl);
    if(req.session.username){
         next();
    }else{
         res.status(403).send(`
            <h1>You must login first to access this page</h1>
            <div>
                <a href="/">Login Page</a>
            </div>
         `);
    }
}


// logout-GET
app.get("/logout",function(req,res){
    if(req.session.username){
        req.session.destroy(function(err){
            if(err)
                throw err;
            console.log("user successfully logged out /logout");
            res.redirect("/");
        });
    }else{
        console.log("user redirected to /");
        res.redirect("/");
    }
});


app.get("/out",function(req,res){
    pathReader.readHTMLFile("logout",res);
});
app.get("/menu",authMiddleware,function(req,res){
    pathReader.readHTMLFile("menu",res);
});
app.get("/info",authMiddleware,function(req,res){
    pathReader.readHTMLFile("setting",res) ;
});
app.get("/",function(req,res){
    pathReader.readHTMLFile("index",res);
});


app.listen(9600,function(){
    console.log("listening on port 9600");
});