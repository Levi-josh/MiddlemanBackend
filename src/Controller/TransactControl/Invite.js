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
    msgUnread:0,
    profilePic:user.profilePic,
})

const sendInvite = async (req, res, next) => {
  const { userid, myid } = req.body;
  const generatedToken = crypto.randomUUID();

  try {
      const inviter = await users.findOne({ _id: myid });
      const invitedUser = await users.findOne({ _id: userid });

      if (!inviter || !invitedUser) {
          return res.status(404).json({ error: 'User not found!' });
      }

      const notify = invitedUser.notification.find(prev => prev.username === inviter.username);
      if (notify && notify.note === `Hi ${invitedUser.username} you have been invited by ${inviter.username} for a business transaction`) {
          return res.status(400).json({ error: 'Request has already been sent' });
      }

      const mydetails = {
          accept: false,
          reject: false,
          username: inviter.username,
          note: `Hi ${invitedUser.username} you have been invited by ${inviter.username} for a business transaction`,
          pic: inviter.profilePic
      };

      await users.findOneAndUpdate(
          { _id: userid },
          { $push: { notification: mydetails } }
      );

      // Send immediate response to the client
      res.status(200).json({ message: 'Invitation sent successfully.' });

      // Start background task
      handleInvitationResponse(userid, myid, generatedToken, inviter, invitedUser);

  } catch (err) {
      console.error('Error in sendInvite:', err.message);
      next(err);
  }
};

// Background process to check invitation response
const handleInvitationResponse = async (userid, myid, generatedToken, inviter, invitedUser) => {
  try {
      const checkNotification = async () => {
          const invitedUser = await users.findOne({ _id: userid });
          if (!invitedUser) {
              throw new Error('User not found during notification check!');
          }
          const choice = invitedUser.notification.find(prev => prev.username === inviter.username);
          console.log(choice)
            if (choice?.accept) {
                // Handle accept logic
                console.log('request accepted')
                const mydetails2 = {
                  username: invitedUser.username,
                  note: `Hi ${inviter.username} your business transaction invitation sent to ${invitedUser.username} has been accepted`,
                  pic: inviter.profilePic
              };
              await users.updateOne({ _id: inviter._id }, { $push: { notification: mydetails2 } });
              await users.updateOne({ _id: inviter._id }, { $push: { chats: chatdetails(invitedUser) } });
              await users.updateOne({ _id: userid }, { $push: { chats: chatdetails(inviter) } });
              await users.updateOne({ _id: inviter._id }, { $push: { transaction: createTransactionDetails(invitedUser._id, generatedToken) } });
              await users.updateOne({ _id: userid }, { $push: { transaction: createTransactionDetails(inviter._id, generatedToken) } });
              console.log('Invite accepted');
              return { message: 'Invite accepted' };
          }

          if (choice?.reject) {
              // Handle reject logic
              const mydetails2 = {
                  username: invitedUser.username,
                  note: `Hi ${inviter.username} your business transaction invitation sent to ${invitedUser.username} was rejected, do well to send another one `,
                  pic: inviter.profilePic
              };
              await users.updateOne({ _id: inviter._id }, { $push: { notification: mydetails2 } });
              console.log('Invite rejected');
              return { message: 'Invite rejected' };
          }

          return null;
      };

      // Polling loop
      let retryCount = 0;
      const maxRetries = 12; // Polling limit
      while (retryCount < maxRetries) {
          const result = await checkNotification();
          if (result) {
              break; // Stop polling if result is found
          }
          await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
          retryCount++;
      }

  } catch (err) {
      console.error('Error in handleInvitationResponse:', err.message);
  }
};


// const sendInvite = async (req, res, next) => {
//     const { userid, myid } = req.body;
//     const generatedToken = crypto.randomUUID();
  
//     try {
//         const inviter = await users.findOne({ _id: myid });
//         const invitedUser = await users.findOne({ _id: userid });
//         const notify = invitedUser.notification.filter(prev=>prev.username == inviter.username)
//         if (!inviter || !invitedUser){ 
//         throw new Error('No user found!')
//         }
//         if(notify[0].note==`Hi ${invitedUser.username} you have been invited by ${inviter.username} for a business transaction`){
//           throw new Error('Request has already been sent')
//         }
//         const mydetails = {
//             accept: false,
//             reject: false,
//             username: inviter.username,
//             note: `Hi ${invitedUser.username} you have been invited by ${inviter.username} for a business transaction`,
//             pic:inviter.profilePic    
//         };
//         const mydetails2 = {
//             username: invitedUser.username,
//             note: `Hi ${inviter.username} your business transaction invitation sent to ${inviter.username} was rejected, do well to send another one `,
//             pic:inviter.profilePic
//         };
//         await users.findOneAndUpdate({ _id: userid }, { $push: { notification: mydetails } });
//         const checkNotification = async () => {
//             const invitedUser = await users.findOne({ _id: userid });
//             if (!invitedUser){ 
//               throw new Error('No user found2!')
//               }
//             const choice = invitedUser.notification.find(prev => prev.username == inviter.username);
//             if (choice?.accept) {
//                 await users.updateOne({ _id: inviter._id }, { $push: { chats: chatdetails(invitedUser) } });
//                 await users.updateOne({ _id: userid }, { $push: { chats: chatdetails(inviter) } });
//                 await users.updateOne({ _id: inviter._id }, { $push: { transaction: createTransactionDetails(invitedUser._id, generatedToken) } });
//                 await users.updateOne({ _id: userid }, { $push: { transaction: createTransactionDetails(inviter._id, generatedToken) } });
//                 return { message: 'Invite accepted' }; // to break the loop
//             }
//             if (choice?.reject) {
//                 await users.updateOne({ _id: inviter._id }, { $push: { notification: mydetails2 } });
//                 return { message: 'Invite rejected' };; // to break the loop
//             }
//             return null;
//         };

//         const checkInvitations = async () => {
//           while (true) {
//               const result = await checkNotification();
//               if (result) {
//                   return res.status(200).json(result);
//               }
//               await new Promise(resolve => setTimeout(resolve, 10000)); // Polling every 10 seconds
//           }
//       };

//       await checkInvitations();
//     } catch (err) {
//         next(err);
//     }
// };
const acceptInvite = async(req,res,next)=>{
  const noteId = req.params.id1
  const myid = req.params.id2
  try {
    const mydetails = await users.findOne({_id:myid})
    const decide = mydetails.notification.find(prev=>prev._id == noteId)
    await users.updateOne({'notification._id':noteId},{$set:{'notification.$.accept':!decide.accept}})
    res.status(200).json({message:'done'})
  } catch (err) {
    next(err)
  }
}
const rejectInvite = async(req,res,next)=>{
  const noteId = req.params.id1
  const myid = req.params.id2
  try {
  const mydetails = await users.findOne({_id:myid})
  const decide = mydetails.notification.find(prev=>prev._id == noteId)
  await users.updateOne({'notification._id':noteId},{$set:{'notification.$.reject':!decide.reject}})
  res.status(200).json({message:'done'})
  } catch (err) {
    next(err)
  } 
}
const searchInvite = async(req,res,next)=>{
  const {id} = req.params
  console.log(id)
  try {
    const invitedUser = await users.findOne({inviteCode:id})
    console.log(invitedUser)
    if(!invitedUser){
      throw new Error('No user with that invitecode is found')
    }
    res.status(200).json({username:invitedUser.username,id:invitedUser._id,profilePic:invitedUser.profilePic})
  } catch (err) {
    next(err)
  }
}
module.exports = {searchInvite,rejectInvite,acceptInvite,sendInvite}