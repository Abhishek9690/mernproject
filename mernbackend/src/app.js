require("dotenv").config();
const express=require("express");
const app=express();
const path=require("path");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const port =process.env.port || 8000;
require("./db/conn");
const hbs=require("hbs");

const Register=require("./models/registers");


const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");


app.use(express.static(static_path))
app.set("view engine","hbs");
app.set("views",template_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.get("/signup",(req,res)=>{
    res.render("signup");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/signupp",async(req,res)=>{
    try{
         const password=req.body.password;
         const confirmPasssword=req.body.confirmPassword;
         if(password==confirmPasssword){
              const registerEmployee=new Register({
                  username:req.body.username,
                  email:req.body.email,
                  password:req.body.password,
              })

              console.log("the success part "+registerEmployee);
              const token=await registerEmployee.generateAuthToken();
              
              console.log("the token part is"+token);

              const registered=await registerEmployee.save();
              console.log("the page part is"+registered);
              res.status(201).redirect("login");
         }
         else{
             res.send("passwords are not matching");
         }
    }
    catch(err){
         res.status(400).send(err);
         console.log("the error part page");
    }
})

//login check   
app.post("/loginn",async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password
        const useremail=await Register.findOne({email:email});

        const isMatch=await bcrypt.compare(password,useremail.password);
        const token=await useremail.generateAuthToken();
              
              console.log("the token part is"+token);
        if(isMatch){
            res.status(201).render("signup");
        }
        else{
            res.send("Invalid password details");
        }
    }
    catch(err){
        console.log("Invalid login details"); 
        res.status(400).send("Invalid login details");
    }
})

//cookies
/* const jwt=require("jsonwebtoken");

const createToken =async()=>{
    const token = await jwt.sign({_id:"606bd81f2b5f3717fc72f6e8"},"mynameisabhishekguptaandiamasoftwareengineer",{
        expiresIn:"2 seconds"
    });
    console.log(token);

    const userVer=await jwt.verify(token,"mynameisabhishekguptaandiamasoftwareengineer");
    console.log(userVer);
}



createToken(); */

app.listen(port,()=>{
    console.log(`connection is successful at port no ${port}`)
})