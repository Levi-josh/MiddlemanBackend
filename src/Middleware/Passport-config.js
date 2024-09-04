// Import required modules
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

passport.use('google', new OAuth2Strategy ({
  clientID: '658900727504-8vmac3p57p22a8en38m6duk3ritde4fo.apps.googleusercontent.com',
  clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3500/auth/google/callback',
    authorizationURL: 'https://accounts.google.com/o/oauth2/auth',
    tokenURL: 'https://accounts.google.com/o/oauth2/token'
  },
  function(accessToken, refreshToken, profile, done) {
    console.log('OAuth Callback Triggered');
    console.log(accessToken)
    console.log(refreshToken)
    console.log(profile)
    // OAuth callback logic
    // This function is called after the user authorizes access
    // You can handle the user's profile data here
    // For example, save the profile to your database or create a new user account
    // Call the `done` callback to indicate success and pass the user's profile
    done(null, profile);
  }
));

module.exports = passport;