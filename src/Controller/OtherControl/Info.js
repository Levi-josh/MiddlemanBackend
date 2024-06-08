const users = require('../../models/UserSchema')

const getUsers = async(req,res,next ) => {
try {
    const user = await users.findOne({_id:req.params.id})
    res.status(200).json(user)   
} catch (err) {
   next(err) 
}
}

const getMessages = async(req,res,next ) => {
    try {
        const user = await users.findOne({'chats._id':req.params.id})
        const messages = user.chats.filter(prev=>prev._id == req.params.id)
        res.status(200).json(messages[0].messages)   
    } catch (err) {
       next(err) 
    }
    }

module.exports = {getUsers,getMessages}