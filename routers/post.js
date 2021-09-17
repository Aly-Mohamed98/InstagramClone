const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requiredLogin = require('../middleware/requiredLogin');
const Post = mongoose.model('Post');



router.get('/AllPosts', requiredLogin, function(req, res){
    Post.find(function(err, posts){ // .find if no parameters were given to it then it'll retrieve all the posts stored in the database
        if(err){
            console.log(err);
        }
        else{
            res.json({posts});
        }
    }).populate("postedBy", "_id name") //allow only the id and the name to appear for the user who posted this post from the user data
    .populate("comments.postedBy", "_id name" ) //allow the name and the id to be sent for the user writing the comment from the user data

});

router.get('/followingPosts', requiredLogin, function(req, res){
    Post.find({postedBy:{$in:req.user.following}}, //making a condition to return only the posts that the user followed their accounts
        function(err, posts){ // .find if no parameters were given to it then it'll retrieve all the posts stored in the database
        if(err){
            console.log(err);
        }
        else{
            res.json({posts});
        }
    }).populate("postedBy", "_id name") //allow only the id and the name to appear for the user who posted this post from the user data
    .populate("comments.postedBy", "_id name" ) //allow the name and the id to be sent for the user writing the comment from the user data

});

//listing all the posts that were added by the user
router.get('/myposts', requiredLogin, function(req, res){
    Post.find({postedBy: req.user._id}, function(err, foundItem){ // find from all posts, posts that are posted by the user making this request
            if (foundItem){
                res.json({foundItem});
            }
            else{
                res.statues(422).json({error:err});
            }
    }).populate("postedBy", "_id name email"); // Show in the field of postedBy the id, the name and email of the user who posted it
})

router.post('/CreatePost', requiredLogin, function(req, res){
    const {title,body, url} = req.body;
    if (!title || !body || !url){
        return res.status(401).json({error:"You have to enter all fields"});
    }
    //console.log(req.user);
    req.user.password = undefined //so the password doesn't appear in the user data
    const post = new Post({
        title: title,
        body: body,
        photo: url,    
        postedBy: req.user
    });
    post.save(function(err, result){
        if(err){
            console.log(err)
        }
        else{
            res.json({post:result});
        }
    })
})

router.put('/likes', requiredLogin, function(req, res){
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{likes:req.user._id} //pushing the user id in the likes array that is initialized in the posts model
    }, {
        new:true //so mongodb won't return to us an old record. it'll return a newly updated one. 
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            //console.log(result)
            return res.json(result)
        }
    })
})

router.put('/comments', requiredLogin, function(req, res){
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {
        $push:{comments:comment} //pushing the user id in the likes array that is initialized in the posts model
    }, {
        new:true //so mongodb won't return to us an old record. it'll return a newly updated one. 
    })
    .populate("comments.postedBy", "_id name" )
    .populate("postedBy","_id name")
    .exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            //console.log(result)
            return res.json(result)
        }
    })
})

router.put('/unlike', requiredLogin, function(req, res){ // "put" updates the model's data 
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id} //removing the user id from the likes array.
    }, {
        new:true //so mongodb won't return to us an old record. it'll return a newly updated one. 
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else{
            return res.json(result)
        }
    })
})

router.delete('/deletePost/:postId', requiredLogin, function(req, res){
    Post.findOne({_id:req.params.postId}) //getting the required post from the database
    .populate("postedBy","_id") // requiring the id of the user who posted the required post
    .exec((err, foundPost)=>{
        if(err || !foundPost){
            res.status(422).json({error: err})
        }
        if(foundPost.postedBy._id.toString() === req.user._id.toString()){ //making sure that the user deleting the post is the same user who posted it
            foundPost.remove() //deleting the post
            .then(result=>{
                res.json(result) //sending back the posts after the successfully deleting the post
            }).catch(err=>{
                console.log(err)
            })
      }
    })  
})


module.exports = router;