const {Schema, model}=require('mongoose')

const PinSchema = new Schema({
    username:{
        type:String,
        require:true,
        
    },
    title:{
        type: String,
        require:true,
        min:3,
        max:60
    },
    desc:{
        type: String,
        require:true,
        min:3,
    },
    rating:{
     type:Number,
     require:true,
     min:0,
     max:5
    },                          
    long:{
        type:Number,
        require:true
    },
    lat:{
      type:Number,
      require:true
    }



},{
    timestamps:true,
})


const Pin =model("Pin",PinSchema)
module.exports=Pin;

