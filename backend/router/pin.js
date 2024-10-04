
const router=require("express").Router();
const Pin =require("../module/Pin");

// create a pin
router.post("/",async(req,res)=>{
    const newPin=new Pin(req.body)
    try {
       const savePin=await newPin.save();
       res.status(200).json(savePin)
    } catch (error) {
        res.status(500).json(error)
    }
});

//get all pin
router.get("/pin",async(req,res)=>{
    try {
        const pin=await Pin.find()
        res.status(200).json(pin)
        
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports=router;
