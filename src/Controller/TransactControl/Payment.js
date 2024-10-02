const users = require('../../models/UserSchema')

const searchWallet = async(req,res,next)=>{
    const walletid = req.params.id
    try {
      const seachedUser = await users.findOne({walletid})
      if(!seachedUser){
        throw new Error('No user found')
      }
      res.status(200).json({username:seachedUser.username,_id:seachedUser._id,profilePic:seachedUser.profilePic})
    } catch (err) {
      next(err)
    }
  }
const deposit = async(req,res,next)=>{
    const Id = req.user
    const {amount} = req.body
    try {
      const seachedUser = await users.findOne({_id:Id._id})
      if(!seachedUser){
        throw new Error('No user found')
      }
      await users.updateOne({ _id: Id._id }, { $inc: { balance: amount } });
      res.status(200).json({message:'deposited'})
    } catch (err) {
      next(err)
    }
  }
// const makePayment = async(req,res,next) => {
//   const {amount,userId,otherUserId} = req.body
//   let check = true
//   try {
//     const receiver = await users.findOne({_id:otherUserId}) 
//     const hasDeal = receiver.transaction.find(prev=>prev.transactionWith == userId )
//     if (!hasDeal) {
//       await users.updateOne({_id:otherUserId},{$set:{balance:receiver.balance+amount}})
//     }
//     await users.updateOne({_id:otherUserId},{$set:{pending:receiver.pending+amount}})

//     while(check){
//       if(hasDeal.completed){
//       await users.updateOne({_id:otherUserId},{$set:{balance:receiver.balance+amount}})
//       await users.updateOne({_id:otherUserId},{$set:{pending:receiver.pending-amount}})
//       check=false
//       }
//       await new Promise(resolve => setTimeout(resolve, 1000));
//     }
//   } catch (err) {
//     next(err)
//   }
// }
const makePayment = async (req, res, next) => {
  const Id = req.user
  const { amount, recipientId } = req.body;
  try {
      const sender = await users.findOne({ _id: Id._id });
      const enoughFund = sender.balance>amount
      if(!enoughFund){
        throw new Error('Insufficient balance!') 
      }
      const receiver = await users.findOne({ _id: recipientId });
      if (!receiver) {
        throw new Error('No user found')
      }
      const hasDeal = receiver.transaction.find(prev => prev.transactionWith == Id._id);
      if (!hasDeal) {
          await users.updateOne({ _id: recipientId }, { $inc: { balance:receiver.balance + amount } });
          await users.updateOne({ _id:Id._id }, { $inc: { balance:sender.balance - amount } });
      }
      await users.updateOne({ _id: recipientId }, { $inc: { pending:receiver.pending + amount } });
      await users.updateOne({ _id:Id._id }, { $inc: { balance:sender.balance - amount } });

      // Polling function to check for transaction completion
      const pollForCompletion = async () => {
          while (true) {
              const updatedReceiver = await users.findOne({ _id: recipientId });
              const updatedDeal = updatedReceiver.transaction.find(prev => prev.transactionWith == Id._id);
              if (updatedDeal && updatedDeal.completed) {
                  await users.updateOne({ _id: recipientId }, { $inc: { balance:updatedReceiver.balance + amount, pending:updatedReceiver.pending - amount } });
                  return { message: 'Payment completed and balance updated' };
              }
              await new Promise(resolve => setTimeout(resolve, 1000)); // Polling every 1 second
          }
      };
      const result = await pollForCompletion();
      res.status(200).json(result);
  } catch (err) {
      next(err);
  }
};
// const makePayment = async (req, res, next) => {
//   const { amount, userId, recipientId } = req.body;
//   try {
//       const receiver = await users.findOne({ _id: recipientId });
//       if (!receiver) {
//         throw new Error('Receiver not found')
//       }
//       const hasDeal = receiver.transaction.find(prev => prev.transactionWith == userId);
//       if (!hasDeal) {
//           await users.updateOne({ _id: recipientId }, { $inc: { balance: amount } });
//       }
//       await users.updateOne({ _id: recipientId }, { $inc: { pending: amount } });

//       // Polling function to check for transaction completion
//       const pollForCompletion = async () => {
//           while (true) {
//               const updatedReceiver = await users.findOne({ _id: recipientId });
//               const updatedDeal = updatedReceiver.transaction.find(prev => prev.transactionWith == userId);
//               if (updatedDeal && updatedDeal.completed) {
//                   await users.updateOne({ _id: recipientId }, { $inc: { balance: amount, pending: amount } });
//                   return { message: 'Payment completed and balance updated' };
//               }
//               await new Promise(resolve => setTimeout(resolve, 1000)); // Polling every 1 second
//           }
//       };
//       const result = await pollForCompletion();
//       res.status(200).json(result);
//   } catch (err) {
//       next(err);
//   }
// };

module.exports = {makePayment,searchWallet,deposit}