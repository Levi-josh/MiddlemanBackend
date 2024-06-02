const passport = require('passport');

const authCallback= ()=>{
    return passport.authenticate('provider', {
        successRedirect: '/',
        failureRedirect: '/login',
    })  
}
const passportAuth= ()=>{
    return passport.authenticate('provider') 
}

module.exports = {
 authCallback,
  passportAuth
}