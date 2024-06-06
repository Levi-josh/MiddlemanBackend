const users = require('../../models/UserSchema')
const crypto = require('crypto');
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

const sendInvite = async (req, res, next) => {
    const { userid, myid } = req.body;
    const generatedToken = crypto.randomUUID();
    console.log(generatedToken);

    try {
        const inviter = await users.findOne({ _id: myid });
        if (!inviter) {
            return res.status(404).json({ message: 'Inviter not found' });
        }

        const mydetails = {
            accept: false,
            reject: false,
            username: inviter.username,
            note: `You have been invited by ${inviter.username} for a business transaction`,
            profilePic: inviter.profilePic,
            socketId: inviter.socketId
        };

        await users.findOneAndUpdate({ _id: userid }, { $push: { notification: mydetails } });

        const checkNotification = async () => {
            const invitedUser = await users.findOne({ _id: userid });
            const choice = invitedUser.notification.find(prev => prev.username == inviter.username);

            if (choice?.accept) {
                await users.updateOne({ _id: inviter._id }, { $push: { chats: chatdetails(invitedUser) } });
                await users.updateOne({ _id: userid }, { $push: { chats: chatdetails(inviter) } });
                await users.updateOne({ _id: inviter._id }, { $push: { transaction: createTransactionDetails(invitedUser._id, generatedToken) } });
                await users.updateOne({ _id: userid }, { $push: { transaction: createTransactionDetails(inviter._id, generatedToken) } });
                return { message: 'Invite accepted' }; // to break the loop
            }

            if (choice?.reject) {
                await users.updateOne({ _id: inviter._id }, { $push: { notification: `${invitedUser.username} rejected your invite` } });
                return { message: 'Invite rejected' };; // to break the loop
            }

            return null;
        };

        const checkInvitations = async () => {
          while (true) {
              const result = await checkNotification();
              if (result) {
                  return res.status(200).json(result);
              }
              await new Promise(resolve => setTimeout(resolve, 10000)); // Polling every 10 seconds
          }
      };

      await checkInvitations();
    } catch (err) {
        next(err);
    }
};
const acceptInvite = async(req,res,next)=>{
  const {myid,noteId} = req.body
  try {
    const mydetails = await users.findOne({_id:myid})
    const decide = mydetails.notification.find(prev=>prev._id == noteId)
    await users.updateOne({'notification._id':noteId},{$set:{'notification.$.accept':!decide.accept}})
    res.status(200).json({"message":'done'})
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
  console.log(inviteCode)
  try {
    const invitedUser = await users.findOne({inviteCode})
    console.log(invitedUser)
    if(!invitedUser){
      throw new Error('No user with that invitecode is found')
    }
    res.status(200).json({username:invitedUser.username,_id:invitedUser._id,profilePic:invitedUser.profilePic})
  } catch (err) {
    next(err)
  }
}
module.exports = {searchInvite,rejectInvite,acceptInvite,sendInvite}