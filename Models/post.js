const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types; //getting all mongoose object types
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    photo:{
        type: String,
        required: true
    },
    likes:[{type: ObjectId, ref:"User"}], //an array of user ids who have pressed the like button 
    comments:[{
        text: String,
        postedBy: {type: ObjectId, ref:"User"}
    }],
    postedBy:{
        type: ObjectId,
        ref:"User" // specifying the object type which is the user model
    } // in this attribute there needs to be a relationship between this post model and the user model

}, {timestamps:true})

mongoose.model('Post', postSchema)