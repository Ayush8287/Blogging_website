
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash')
const mongoose = require('mongoose')
const homeStartingContent = "YEAA!! YOU MADE IT.WELCOME TO  THE DAILY JOURNAL.YOU CAN START WRITING AND PUBLISHING YOUR BLOGS BY CLICKING ON COMPOSE LINK.";
const aboutContent = "We Are the Daily Journal.It is my debut website so it is a blogging website where you can create and read world's best blogs";

const contactContent = "lorem100";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/loginDb',{useNewUrlParser:true});
const validSchema = new mongoose.Schema({
  name:String,
  password:String
})
const blogSchema = new mongoose.Schema({
  title:String,
  blog:String
})
const Auth = mongoose.model("Auth",validSchema)
const Blog = mongoose.model("Blog",blogSchema)

app.get("/signup",(req,res)=>{
  res.render('signup',{alert:""})
})
app.post("/signup",(req,res)=>{
  const namee = req.body.name;
  const pass = req.body.password;
  Auth.findOne({name:namee},(err,foundP)=>{
    if(foundP){
      res.render("signup",{alert:"Person Already exists.!..Try another Username"})
      
    }
    else{
      const person = new Auth({
        name:namee,
        password:pass
      })
      person.save();
      
      res.redirect("/home")

    }
  })
  
})


var posts = [];

app.get("/",(req,res)=>{
  res.render('signup',{alert:""})
})
app.get("/login",(req,res)=>{
      res.render('login')

})
app.post("/login",(req,res)=>{
  let lognam = req.body.logname
  let logpass = req.body.logpassword
  Auth.findOne({name:lognam,password:logpass},(err,foundItems)=>{
    if(foundItems){
      res.redirect("/home")
    }
    else{
      res.redirect("/signup")
    }
  })
})
app.get("/home",(req,res)=>{
  Blog.find({},(err,foundBlogs)=>{

    res.render('home',{homeContent:homeStartingContent,
      posts:foundBlogs
    })

  })
  
  
  
  
})
app.get("/contact",(req,res)=>{
  res.render('contact',{contContent:contactContent})
})
app.get("/about",(req,res)=>{
  res.render('about',{abContent:aboutContent})
})
app.get("/compose",(req,res)=>{
  res.render('compose')
})
app.get("/posts/:postName",(req,res)=>{
  let reqTitle = req.params.postName;
  let newArr = [];
  reqTitle = _.lowerCase(reqTitle)
  Blog.find({},(err,foundBlogs)=>{
    if(!err){
      foundBlogs.forEach((item)=>{
        let itemTitle = _.lowerCase(item.title);
        if(itemTitle==reqTitle){
          newArr.push(item)
          res.render('post',{posts:newArr})
        }
      })
    }
    else{
      res.write("<h1>404 NOT FOUND!<h1>")
    }


  })
  
 
  
  // res.render('post',{posts:specificPostArr})
  

})
app.post("/compose",(req,res)=>{
  const blog = new Blog({
    title:req.body.title,
    blog:req.body.post
  })
  blog.save(function(err){
    if(!err){

      res.redirect("/home")
    }
    else{
      res.write("404,OOPS! SOMETHING WENT WRONG,PLEASE TRY AGAIN LATER.WE ARE SORRY FOR THIS. ")
    }
  })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
