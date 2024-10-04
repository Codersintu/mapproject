const {Schema, model} = require("mongoose")

const UserSchema=new Schema({
    username:{
        type: String,
        require:true,
        min:3,
        max:10,
        unique:true,

    },
    email:{
        type:String,
        require:true,
        unique:true,
        max:50,
    },
    password:{
        type:String,
        require:true,
        min:6,
    },

})
const User=model("User",UserSchema)
module.exports=User