const mongoose=require("mongoose");
const { username, password } = require("../schemas/type");  
mongoose.connect("mongodb+srv://admin:password_123@cluster0.5tyec.mongodb.net/multiplayer-chess?retryWrites=true&w=majority&appName=Cluster0")
const userSchema=mongoose.Schema({
    username:String,
    password:String
})
const data=mongoose.model("userData",userSchema);
module.exports={
    data
}
