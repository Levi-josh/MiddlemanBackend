// Import required modules
const passport = require('passport');
const OAuth2Strategy = require('passport-google-oauth20').Strategy;
const users = require('../models/UserSchema')
const crypto = require('crypto');

passport.use('google', new OAuth2Strategy ({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://middlemanbackend.onrender.com/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if the user already exists
      let user = await users.findOne({ email: profile.emails[0].value });
     
      if (user) {
        if (!user.googleId) {
         await users.updateOne({ email: profile.emails[0].value },{$set:{googleId:profile.id}})
        }
        return done(null, user);
      }else{
      const userData = {
        googleId: profile.id,
        email: profile.emails[0].value,
        profilePic: profile.photos[0].value,
        username: profile.displayName,
        socketId:'',
        chats:[],
        balance:1000,
        pending:0,
        walletId:crypto.randomUUID(),
        inviteCode:crypto.randomUUID(),
        notification:[],
        history:[],
        };
        const newUser = await users.create(userData);
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, false);
    }
  }
));
passport.serializeUser((user, done) => {
  done(null, user._id);  // Serialize only the user ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findById(id);  // Find the user by ID
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;