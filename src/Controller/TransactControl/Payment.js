const users = require('../../models/UserSchema')

const searchWallet = async(req,res,next)=>{
    const {walletid} = req.body
    try {
      const seachedUser = await users.findOne({walletid})
      if(!seachedUser){
        throw new Error('No user with that invitecode is found')
      }
      res.status(200).json({username:seachedUser.username,_id:seachedUser._id,profilePic:seachedUser.profilePic})
    } catch (err) {
      next(err)
    }
  }
const makePayment = async(req,res,next) => {
  const {amount,userId,otherUserId} = req.body
  let check = true
  try {
    const receiver = await users.findOne({_id:otherUserId}) 
    const hasDeal = receiver.transaction.find(prev=>prev.transactionWith == userId )
    if (!hasDeal) {
      await users.updateOne({_id:otherUserId},{$set:{balance:receiver.balance+amount}})
    }
    await users.updateOne({_id:otherUserId},{$set:{pending:receiver.pending+amount}})

    while(check){
      if(hasDeal.completed){
      await users.updateOne({_id:otherUserId},{$set:{balance:receiver.balance+amount}})
      await users.updateOne({_id:otherUserId},{$set:{pending:receiver.pending-amount}})
      check=false
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (err) {
    next(err)
  }
}
module.exports = {makePayment,searchWallet}