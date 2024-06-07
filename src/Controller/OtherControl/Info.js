const users = require('../../models/UserSchema')

const getUsers = async(req,res,next ) => {
try {
    const user = await users.findOne({_id:req.params.id})
    res.status(200).json(user)   
} catch (err) {
   next(err) 
}
}

module.exports = {getUsers}