const express=require("express");
const { username, password } = require("../schemas/type");
const { data } = require("../database/db");
const cors=require("cors");
const app=express();
app.use(express.json());
app.use(cors());

app.post("/signup",async function(req,res){
//    const createUser=req.body;
//    const createPassword=req.body
   const {username:createUser,password:createPassword}=req.body;
   const parseUser=username.safeParse(createUser);
   const parsePassword=password.safeParse(createPassword)
   console.log("Validation Results:", { parseUser, parsePassword })
   if(!parseUser.success || !parsePassword.success){
    res.status(400).json({
        msg:"You sent the wrong input"
    })
    return ;
   }
   try{
    const hashedPassword=await bcrypt.hash(createPassword,10);
    const newUser = await data.create({
        username: createUser,
        password: hashedPassword,
      });
      console.log("User created successfully: ", newUser);
    res.status(201).json({
        msg:"User created",
        username:newUser.username,
    })

   }catch(err){
     console.error("Error in inserting userdata",err);
     res.status(500).json({
        msg:"Error inserting userdata"
     })
   }
})

app.post("/signin",async function(req,res){
    const {username:inputUser,password:inputPassword}=req.body;
    try{
        const user=await findOne({username:inputUser});
        if(!user){
            return res.status(401).json({msg:"Invalid credentials"})
        }
        const isPasswordValid=await bcrypt.compare(inputPassword,user.password)
        if(!isPasswordValid){
            return res.status(401).json({msg:"Invalid credentials"})
        }
        res.status(200).json({msg:"Signin is successful ",username:user.username})
    }catch(err){
        console.error("Error during sign in ",err);
        res.status(500).json({
            msg:"Error during sign in "
        })
    }
})

// app.get("/signinn", async function (req, res) {
//     try {
//       const userData = await data.find({});
//       res.json({ userData });
//     } catch (err) {
//       console.error("Error fetching data: ", err);
//       res.status(500).json({ msg: "Error fetching user data" });
//     }
//   });
app.listen(3000);