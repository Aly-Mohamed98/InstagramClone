const jwt = require('jsonwebtoken');
const {SECRET_JWT} = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next)=> {
    const {authorization} = req.headers //if the user doesn't have an authorization header he won't be allowed tp be logged in
    if(!authorization){
        return res.status(401).json({error:"You must be logged in"});
    }
    const token = authorization.replace("Bearer ", "") //removing the bearer word from the authorized token in the header
    jwt.verify(token, SECRET_JWT, (err, payload)=>{ //verifying the user token 
        if(err){
            return res.status(401).json({error:"you must be logged in"});
        }
        const {_id} = payload
       // console.log(_id); //since there is no error there can an unique id to identify user
        User.findById(_id, function(err, userData){ //finding the user from hhis id in the db
            if(err){
                res.status(401).json({error:"You must be logged in"});
            }
            //console.log(userData);
            req.user = userData //adding data about the user in the req to be able to fetch it for user identification 
            next() //call the callback function
        })
    })
}