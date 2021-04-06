const mongoose =require("mongoose");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const employeeSchema=new mongoose.Schema({
    username:{
        type:String,
        reqired:true
    },
    email:{
        type:String,
        reqired:true,
        unique:true,
    },
    password:{
        type:String,
        reqired:true
    },
    tokens:[{
        token:{
            type:String,
            reqired:true
        }
    }]
    
})

//generating tokens

employeeSchema.methods.generateAuthToken=async function(){
    try{
        console.log(this._id);
        const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;
    }
    catch(error){
        res.send("the error part is"+error);
        console.log("the error part is"+error);

    }
}



//converting password into hash or bcrypt
employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
    this.password=await bcrypt.hash(this.password,2);
    
    }
    next();
    
})

//now we need to create a collection

const Register=new mongoose.model("Register",employeeSchema);

module.exports = Register;