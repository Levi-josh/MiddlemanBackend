const users = require('../../models/UserSchema')

const buyerOrSeller = async(req,res,next)=>{
    const {userid,buyOrSellId,myid} = req.body
    try {
    const firstUser = await users.findOne({_id:userid})
    const mychatdetails = firstUser.transaction.find(prev=>prev.transactionWith == myid) 
    const myOptions = mychatdetails.buyOrSell.find(prev=>prev._id == buyOrSellId) 

    //code to check if the other user has selected an option already then updated the database
    const secondUser = await users.findOne({_id:myid})  
    const userchatdetails = secondUser.transaction.find(prev=>prev.transactionWith == userid) 
    const userOptions = userchatdetails.buyOrSell.find(prev=>prev._id == buyOrSellId)
    if(userOptions.choosen){
        throw new Error('the other user has selected this option already')
    }
    mychatdetails && await users.updateOne({'transaction._id':mychatdetails._id},{$set:{'transaction.$.buyOrSell.$[elem].choosen':!myOptions.choosen}},{ arrayFilters: [{ "elem._id":buyOrSellId}] })

    } catch (err) {
      next(err)  
    }
}

const sellerDetails = async(req,res,next)=>{
  const {userTransacId,myid,deliveryDate,amount,walletId} = req.body
  const sellerbargain = {
    deliveryDate, 
    amount,
    walletId,
    offer:[{options:'accept',choosen:false},{options:'reject',choosen:false}]
  }
  try {
    await users.updateOne({'transaction._id':userTransacId},{$set:{'transaction.$.deal':sellerbargain}})
  } catch (err) {
    next(err)
  }
}
const chooseOption = async(req,res,next)=>{
  const {userid,myid,userTransacId,offerId} = req.body
  try {
    const buyer = await users.findOne({_id:myid})
    const seller = await users.findOne({_id:userid})
    const transaction = seller.transaction.find(prev=>prev._id == userTransacId)
    const deal = transaction.deals.offer.find(prev=>prev._id == offerId)
    if(deal.options == 'reject'){
      await users.updateOne({'transaction._id':userTransacId},{$pull:{'transaction.$.deal':transaction.deals}})
      // send notification to the seller that the transaction was rejected
      await users.updateOne({_id:userid},{$push:{notification:`${buyer.username} rejected the deal you offered,we advice you both should reach an agreement before proceeding.`}})
    }
      await users.updateOne({'transaction._id':userTransacId},{$set:{'transaction.$.deal':!deal.choosen}})
  } catch (err) {
    next(err)
  }
}
const buyerDetails = async(req,res,next)=>{
  const {userid,myid,userAddress} = req.body
  try {

  } catch (err) {
    next(err)
  }
}

module.exports = {buyerOrSeller,sellerDetails,buyerDetails,chooseOption}