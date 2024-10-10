const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../../models/UserSchema')

const login = async (req, res, next) => {
    const {email,password} = req.body;
    try {
        const user = await users.findOne({
            email:email
        })
        if (user) {
            if(password.length<6){
                throw new Error('password must be six characters')
              }
            const hash = await bcrypt.compare(password,user.password)
            if (hash) {
                const token= jwt.sign({ _id: user._id }, process.env.Access_Token,{ expiresIn: '1d' })
                res.cookie('jwt', token, {  secure: true, sameSite: 'None', maxAge: 1000 * 60 * 60 * 24 });
                res.status(200).json({'UserId':user._id})
                
            } else {
                throw new Error('Incorrect password')
            }
        } else {
            throw new Error(`User doesn't exist`)
        }
    } catch (err) {
        next(err)
    }
}
const checkAuth =  (req, res,next) => {
    const token = req?.cookies?.jwt;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
      jwt.verify(token, process.env.Access_Token, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Invalid or expired token' });
        }
        res.status(200).json({Id:decoded._id});
      }) 
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
  
const logout = async (req, res, next) => {
    try {
    const newjwt = jwt.sign({ _id: req.params.id}, process.env.Access_Token, { expiresIn: '2s' })
    res.status(200).json(newjwt)   
    } catch (err) {
        next(err)
    }
}
module.exports = {login,logout,checkAuth}