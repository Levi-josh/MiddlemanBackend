const users = require('../../models/UserSchema')
const { ObjectId } = require('mongodb')

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
    const user = await users.findById(req.params.id1)
    const mymessages = user.chats.filter(prev=> prev.userId == req.params.id2  )
    console.log(mymessages)
    res.status(200).json(mymessages[0]?.messages)   
} catch (err) {
    next(err) 
}
}
const postPfp= async (req, res, next) => { 
    try {
      const{id,username} = req.body; // Extract text from the form
      const imageUrl = req.file.filename
      const items={
     profilePic:`/uploads/${imageUrl}`,
      username,
      }  
    await users.updateOne({_id:id},{$set:items}); 
      res.json({ message: `/uploads/${imageUrl}`});
    } catch (err) {
    next(err)
    }
  }

module.exports = {getUsers,getMessages,postPfp}