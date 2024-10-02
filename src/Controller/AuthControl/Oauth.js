const passport = require('passport');
const isProduction = process.env.NODE_ENV === 'production';
const jwt = require('jsonwebtoken')
// const { ObjectId } = require('mongodb')
// const mongoose = require('mongoose');

// This function is correct for handling the callback after Google OAuth
const authCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      res.redirect('http://localhost:5173/landingPage'); // Failure redirect
    }
    req.user = user; // Attach user to request object
    next(); // Pass to the next middleware, which will be `jwtAuth`
  })(req, res, next); // Passport callback
};
// This function is correct for initiating the Google OAuth flow
const passportAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

const jwtAuth = async (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { _id: user._id},
      process.env.Access_Token,
      { expiresIn: '1d' }
    );
    res.cookie('jwt', token, {  httpOnly: true,secure: isProduction, maxAge: 1000 * 60 * 60 * 24  });
    res.redirect('http://localhost:5173/');  // Redirect to your SPA client with JWT
  } 

module.exports = {
    authCallback,
    passportAuth,
    jwtAuth
};
