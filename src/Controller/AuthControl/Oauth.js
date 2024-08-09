const passport = require('passport');

const authCallback= ()=>{
    return passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login',
    })  
}
const passportAuth= ()=>{
    return passport.authenticate('google',{ scope: ['profile', 'email'] }) 
}

module.exports = {
 authCallback,
  passportAuth
}