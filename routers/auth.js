const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');//library that has token to send to the user as a response
const {SECRET_JWT} = require('../keys');
const requiredLogin = require('../middleware/requiredLogin');

const User = mongoose.model("User");

router.get('/protected', requiredLogin, function(req, res){
    res.send("Hello");
});

router.post('/SignUp', function(req, res){
    const {name, email, password, pic} = req.body;
    if(!name || !email || !password){ //if the user didn't enter any of those fields 
       return res.status(422).json({error:"You have to enter all fields"})
    }
    User.findOne({email: email}, function(err, foundItem){
            if(foundItem){
                return res.status(422).json({error:"error user mail already exists"})
            }
     bcrpyt.hash(password, 12).then(hashedPassword =>{ //hashing the password before adding user to db, the number next to the passwords is the number of salt and hashing rounds , the bigger thea number the higher the complexity of cracking the hash
                const newUser = new User({
                    name: name,
                    email: email,
                    password: hashedPassword,
                    pic: pic
                 });
                newUser.save(function(err){
                     if(err){
                       res.status(422).json({error:err});
                    }
                    else{
                        res.json({message:"Saved successfuly!"});          
                    }
                });  
            })             
       })

            
});




router.post('/SignIn', function(req, res){
    const { email, password} = req.body;
    if(!email || !password){
      return  res.status(422).send("You have to enter both email and password to sign in");
    }
    User.findOne({email:email}, function(err, foundMatch){
        if(!foundMatch){
            return res.status(422).send("Invalid email or password");
        }
        bcrpyt.compare(password, foundMatch.password)
        .then(foundItem=>{ //comparing the password written by the user to the stored hashed password
            if(foundItem){
               // res.send("Signed in successfully");
                const token = jwt.sign({_id: foundMatch._id}, SECRET_JWT);//generating a token using the id of the user
                const {_id, name, email, followers, following, pic} = foundMatch;//when the user is logged in, his info is being send along with the token 
                res.send({token, user:{_id, name, email, followers, following, pic}})//sending the token as a response to the user
            }
            else{
                res.status(422).send("Invalid mail or password")
            }
        }).catch(err=>{
            res.send(err)
        });

        
    })
     
        

});




module.exports = router;



      
    
    
        // User.register({username: username, name: name} , req.body.password, function(err, user){//the register method comes from the passport-local mongoose package which acts as a middle man between the app and mongoose
        //     if (err){
        //         console.log("and here");
        //         console.log(err);
        //        // res.redirect("/register");//incase of the error the user is redirected to the register page to try again
        //     }
        //     else{
        //         passport.authenticate("local")(req, res, function(){     //authenticating the user using the passport local            
        //             // res.redirect('/secrets');
        //            res.send("DONE")
        //         });
        //     }
    
        // })
        // req.login(user, function(err){ //login function that passport gives us to create the login session
        //     //the user object created above is then provided to the function to check the credentials
    
        //     if(err){//errors like user entered the wrong credentials or something is wrong with the servers which is a lower case
        //         console.log(err);
        //     }
        //     else{
        //         console.log("Here")
        //         passport.authenticate("local")(req, res, function(){ //authenticating the user for the given username and password
        //             //res.redirect("/secrets");
        //             res.send("LOGGED IN")
        //         })
        //     }
        // })
        