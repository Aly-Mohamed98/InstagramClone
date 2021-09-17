const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
// const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    },
    pic: {
        type:String,
        default:"https://res.cloudinary.com/dnihb9u0r/image/upload/v1617036681/no_pic_rsg2aw.jpg"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
}); //creating a user schema for mongoose to know the data it is storing 
// userSchema.plugin(passportLocalMongoose);//this is the library which will hash and salt the passwords and save the user in the database
mongoose.model("User", userSchema); //modeling the userchema to the User class

// module.exports={
//     User: User
// }
