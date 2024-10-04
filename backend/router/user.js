const router=require("express").Router();
const User=require('../module/User')
const bcrypt=require("bcrypt")


router.post("/register",async(req,res)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(req.body.password,salt);

        const newUser=new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
        });

        const user = await newUser.save();
        res.status(200).json(user);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.post("/login", async (req, res) => {
    try {
      // Find the user by username
      const user = await User.findOne({ username: req.body.username });
  
      // If user is not found
      if (!user) {
        return res.status(400).json("Wrong username");
      }
  
      // Validate password
      const validPassword = await bcrypt.compare(req.body.password, user.password);
  
      // If password is not valid
      if (!validPassword) {
        return res.status(400).json("Wrong password");
      }
  
      // Send response with user details
      res.status(200).json({ _id: user._id, username: user.username });
  
    } catch (error) {
      // Log the error and send a server error response
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
  

module.exports=router;