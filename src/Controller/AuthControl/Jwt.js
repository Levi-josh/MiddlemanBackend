const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const users = require('../../models/UserSchema')

const login = async (req, res, next) => {
    try {
        const myusers = await users.findOne({
            'username': req.body.username
        })
        if (myusers) {
            const hash = await bcrypt.compare(req.body.password, myusers.password)
            if (hash) {
                const newjwt = jwt.sign({ _id: myusers._id }, process.env.Access_Token,{ expiresIn: '2 days' })
                res.status(200).json({'Accesss_Token':newjwt,'UserId':myusers._id})
            } else {
                throw new Error('incorrect password')
            }
        } else {
            throw new Error('there is no user with that name')
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