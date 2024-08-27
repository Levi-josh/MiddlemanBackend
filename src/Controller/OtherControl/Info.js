const users = require('../../models/UserSchema')
const { ObjectId } = require('mongodb')
const crypto = require('crypto');


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
const getNotification = async(req,res,next ) => {
try {
    const user = await users.findById(req.params.id)
    const notifications = user.notification
    res.status(200).json({message:notifications})   
} catch (err) {
    next(err) 
}
}
const getCustomers = async(req,res,next ) => {
try {
    const user = await users.findById(req.params.id)
    const customers = user.chats
    res.status(200).json(customers)   
} catch (err) {
    next(err) 
}
}
const getChats = async(req,res,next ) => {
try {
    const user = await users.findById(req.params.id)
    const chats = user.chats.filter(prev=>prev.messages>0)
    res.status(200).json(chats)   
} catch (err) {
    next(err) 
}
}
const getHistory = async(req,res,next ) => {
try {
    const user = await users.findById(req.params.id)
    const history = user.transaction
    res.status(200).json(history)   
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
      walletId:crypto.randomUUID(),
      inviteCode:crypto.randomUUID()

      }  
      const mydetails = {
        username,
        note: `Hi ${username} welcome to the middleman app. we have a web page for frequently asked questions at the top right of the home page,Thank you.`,
        pic:'http://localhost:3500/assets/middlemanImage.jpg' 
    };
    await users.updateOne({_id:id},{$set:items}); 
    await users.findOneAndUpdate({ _id: id }, { $push: { notification: mydetails } }); 
      res.json({ message: `/uploads/${imageUrl}`});
    } catch (err) {
    next(err)
    }
  }

module.exports = {getUsers,getMessages,postPfp,getNotification,getHistory,getCustomers,getChats }