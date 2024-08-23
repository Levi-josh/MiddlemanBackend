const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../../models/UserSchema')

const login = async (req, res, next) => {
    const {email,password} = req.body;
    console.log(email)
    try {
        const user = await users.findOne({
            email:email
        })
        if (user) {
            const hash = await bcrypt.compare(password,user.password)
            if (hash) {
                const newjwt = jwt.sign({ _id: user._id }, process.env.Access_Token,{ expiresIn: '2 days' })
                res.status(200).json({'Accesss_Token':newjwt,'UserId':user._id})
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
const logout = async (req, res, next) => {
    try {
    const newjwt = jwt.sign({ _id: req.params.id}, process.env.Access_Token, { expiresIn: '2s' })
    res.status(200).json(newjwt)    
    } catch (err) {
        next(err)
    }
}
module.exports = {login,logout}