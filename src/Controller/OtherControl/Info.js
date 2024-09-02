const users = require('../../models/UserSchema')
const { ObjectId } = require('mongodb')
const crypto = require('crypto');
const { bucket } = require('../../Utils/Firebasecred')


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
    res.status(200).json(mymessages[0])   
} catch (err) {
    next(err) 
}
}
const markAsRead = async(req,res,next ) => {
    const { userId, contactId } = req.body;
try {
    const user = await users.findOneAndUpdate(
        { _id: userId, 'chats.userId': contactId },
        { $set: { 'chats.$.messages.$[].read': true } }, // Update all messages read status to true
        { new: true }
      );
  
      if (!user) {
        throw new Error('User or contact not found') 
      }
    res.status(200).json({message:'read'})   
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
    const chat = user.chats.filter(prev=>prev.messages.length>0)
    res.status(200).json(chat)   
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
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    const imageUrl = req.file.filename
      // Create a new blob in the bucket and upload the file data
      const blob = bucket.file(Date.now() + path.extname(imageUrl));
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });
      blobStream.on('error', (err) => {
        res.status(500).json({ error: err.message });
      });
  
      blobStream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        try {
            const{id,username} = req.body; // Assuming you have the user's ID in the request body
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
            res.status(200).json({ message:publicUrl});
        } catch (err) {
          next(err)
        }
      });
  
      blobStream.end(req.file.buffer);
  }

module.exports = {getUsers,markAsRead,getMessages,postPfp,getNotification,getHistory,getCustomers,getChats }