const users = require('../../models/UserSchema')
const createTransactionDetails = (transactionWithId,token) => ({
  transactionWith: transactionWithId,
  transactionToken:token,
  buyOrSell: [
    { options: 'Buyer', choosen: false },
    { options: 'Seller', choosen: false },
    { options: 'SellThirdParty', choosen: false },
    { options: 'buyThirdParty', choosen: false },
  ],
  thirdpartyInvite: '',
  deals: {},
  thirdOrSecond: [
    { options: 'secondParty', choosen: false },
    { options: 'thirdParty', choosen: false },
  ],
  complete:false
});

const chatdetails = (user) => ({
    username:user.username,
    userId:user._id,
    socketId:user.socketId,
    messages:[{
      from: 'middleman',
      to: 'the two users' ,
      message: `Tap to start the conversation `,
    }],
    read:false,
    msgUnread:1,
    profilePic:user.profilePic,
})


const sendInvite = async(req,res,next)=>{
  const {userid,myid} = req.body
  let check = true
  const generatedToken = ''//generate id
  try {
  const inviter = await users.findOne({_id:myid})
    const mydetails = {
      userId:inviter._id,
      accept:false,
      reject:false,
      username:inviter.username,
      note:`You have been invited by ${inviter.username} for a business transaction`,
      profilePic:inviter.profilePic,
      socketId:inviter.socketId
  }
  const invitedUser = await users.findOneAndUpdate({_id:userid},{$push:{notification:mydetails}})
  const choice = invitedUser.notification.filter(prev=>prev.userId && prev.userId == mydetails._id)

  while (check) {
    if (choice[0].accept) {
      await users.updateOne({_id:mydetails._id},{$push:{chats:chatdetails(invitedUser)}})
      await users.updateOne({_id:userid},{$push:{chats:chatdetails(mydetails)}})
      // push to transaction also
      await users.updateOne({_id:mydetails._id},{$push:{transaction:createTransactionDetails(invitedUser._id,generatedToken)}})
      await users.updateOne({_id:userid},{$push:{transaction:createTransactionDetails(mydetails._id,generatedToken)}})
      check = false
    }
    if (choice[0].reject) {
      await users.updateOne({_id:mydetails._id},{$push:{notification:`${invitedUser.username} rejected your invite`}})
      check = false
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  } 
  } catch (err) {
    next(err)
  }
}

const acceptInvite = async(req,res,next)=>{
  const {myid,noteId} = req.body
  try {
    const mydetails = await users.findOne({_id:myid})
    const decide = mydetails.notification.find(prev=>prev._id == noteId)
    await users.updateOne({'notification._id':noteId},{$set:{'notification.$.accept':!decide.accept}})
  } catch (err) {
    next(err)
  }
}
const rejectInvite = async(req,res,next)=>{
  const {myid,noteId} = req.body
  try {
  const mydetails = await users.findOne({_id:myid})
  const decide = mydetails.notification.find(prev=>prev._id == noteId)
  await users.updateOne({'notification._id':noteId},{$set:{'notification.$.reject':!decide.reject}})
  } catch (err) {
    next(err)
  } 
}
const searchInvite = async(req,res,next)=>{
  const {inviteCode} = req.body
  try {
    const invitedUser = await users.findOne({inviteCode})
    if(!invitedUser){
      throw new Error('No user with that invitecode is found')
    }
    res.status(200).json({username:invitedUser.username,_id:invitedUser._id,profilePic:invitedUser.profilePic})
  } catch (err) {
    next(err)
  }
}
module.exports = {searchInvite,rejectInvite,acceptInvite,sendInvite}