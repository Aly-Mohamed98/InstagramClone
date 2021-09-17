const express = require('express');
const mongoose = require('mongoose');
const {MONGOURI} = require('./keys');
// const passport = require('passport');
const bodyParser = require('body-parser');
// const session = require('express-session');
require('./Models/user');
require('./Models/post');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({ //initial configuration of the session 
//     secret: PASSPORT_SECRET, //Any long string can be written here
//     resave: false,
//     saveUninitialized: false

// }))
// app.use(passport.initialize()); //this is to initialize passport with a built in function.
// app.use(passport.session());//telling the app to use the session configured from before


mongoose.connect(MONGOURI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});
mongoose.set('useCreateIndex', true); //To resolve a deprecation warning

mongoose.connection.on('connected', ()=>{
    console.log("connected successfully to mongo"); // both of those methods could be usefull to detect if app is failing due to database
});

mongoose.connection.on('error', (err)=>{
    console.log('err connecting', err);

});
mongoose.set('useCreateIndex', true); //To resolve a deprecation warning
const User = mongoose.model('User'); //requiring the user model schema

// passport.use(User.createStrategy());
// passport.serializeUser(function(user, cb){      
//     cb(null, user.id)
// }); // Serializing is basically putting the user data in a cookie meaning it is saved.
// passport.deserializeUser(function(id, cb){
//     User.findById(id, function(err, user){
//         cb(err, user);
//     });
// });
// //deserializing is basically crumbling the cookie to retrieve the data to authenticate the user
// passport.use(new GoogleStrategy({
//     clientID:     GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/Secrets",//if the user is authenticated he'll go directly to the secrets page
//     userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',//retrieve the user info from this link not google plus to avoid errors
//     passReqToCallback   : true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//       console.log(profile);
//     User.findOrCreate({ googleId: profile.id }, function (err, user) { //this is a mongoose package downloaded from npm to frind the user in the database or create one if not found
//       return done(err, user);
//     });
//   }
// )); 
app.use(require('./routers/auth.js')); //requiring the router to access the home page or "/" page
app.use(require('./routers/post.js'));
app.use(require('./routers/user'));




app.listen(5000, ()=>{
    console.log("listening on port 3000")
});