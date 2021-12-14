const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    Email:{
        type:String
    },
    password:{
        type:String
    }
})

const Users=mongoose.model("Users",schema);
module.exports=Users;