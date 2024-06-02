const users = require('../../models/UserSchema')
const { ObjectId } = require('mongodb');
const createTransactionDetails = (transactionWithId,option,token) => ({
  transactionWith: transactionWithId,
  transactionToken:token,
  buyOrSell: [
    { options: 'Buyer', choosen: false },
    { options: 'Seller', choosen: false },
    { options: 'SellThirdParty', choosen:option == 'sell'?true:false },
    { options: 'buyThirdParty', choosen:option == 'buy'?true:false },
  ],
  thirdpartyInvite: '',
  deals: {},
});
// const userId = "someUserId";
// const transactionWithId = "anotherUserId";
// const buyOrSellId = "buyOrSellId2";

// const result = await users.aggregate([
//   { $match: { _id: ObjectId(userId) } },
//   { $unwind: "$transactions" },
//   { $match: { "transactions.transactionWith": transactionWithId } },
//   { $unwind: "$transactions.buyOrSell" },
//   { $match: { "transactions.buyOrSell._id": ObjectId(buyOrSellId) } },
//   { $project: { _id: 0, buyOrSell: "$transactions.buyOrSell" } }
// ]).toArray();

// const buyOrSellOption = result.length > 0 ? result[0].buyOrSell : null;
// console.log(buyOrSellOption);

const deliveryMethod = async(req,res,next) => {
    const {thirdpartyId,sellerId,TransactionId,deliveryMethodId} =req.body
    try {
    const seller = await users.findOne({_id:sellerId})
    const sellerDeal = seller.transaction.find(prev=>prev._id == TransactionId) 
    const deliveryOption = sellerDeal.thirdOrSecond.find(prev._id == deliveryMethodId ) 
    if (deliveryOption.options == 'thirdParty') {
      await users.updateOne({'transaction._id':TransactionId},{$set:{thirdpartyInvite:thirdpartyId}})
      await users.updateOne({_id:thirdpartyId},{$push:{notification:`you've been invited by ${seller.username} to be a third party to a transaction`}})
      await users.updateOne({_id:thirdpartyId},{$push:{transaction:createTransactionDetails(sellerId,'sell',sellerDeal.transactionToken)}})
    }
    res.status(200).json({message:"deliveryMethod has been selected"})
    } catch (err) {
       next(err) 
    }
}
const pickupMethod = async(req,res,next) => {
  const {thirdpartyId,buyerId,TransactionId,deliveryMethodId} =req.body
    try {
      const buyer = await users.findOne({_id:buyerId})
      const buyerDeal =buyer.transaction.find(prev=>prev._id == TransactionId) 
      const deliveryOption = buyerDeal.thirdOrSecond.find(prev._id == deliveryMethodId ) 
      if (deliveryOption.options == 'thirdParty') {
        await users.updateOne({'transaction._id':TransactionId},{$set:{thirdpartyInvite:thirdpartyId}})
        await users.updateOne({_id:thirdpartyId},{$push:{notification:`you've been invited by ${seller.username} to be a third party to a transaction`}})
        await users.updateOne({_id:thirdpartyId},{$push:{transaction:createTransactionDetails(buyerId,'buy',buyerDeal.transactionToken)}})
      }
      res.status(200).json({message:"deliveryMethod has been selected"})   
    } catch (err) {
       next(err) 
    }
}
const verifyPickup = async(req,res,next) => {
  const {password,userId,transactionToken} =req.body
    try {
      const user = await users.findOne({password})  
      if(!user){
        throw new Error('No user with this password')
      }
     const deal = user.transaction.filter(prev=>prev.transactionToken == transactionToken)
     if(!deal){
      throw new Error('User with this password is not part of the transaction')
     }
     const receiver =  deal.find(prev=>prev.transactionWith == userId )
     const isThirdParty = receiver.buyOrSell.find(prev=>prev.options == 'buyThirdParty')
     const isbuyer = receiver.buyOrSell.find(prev=>prev.options == 'Buyer')
     if(isThirdParty.choosen){
      //check if the password matches with the thirdparty password else throw error 'wrong password'
      const thirdparty = await users.findOne({_id:userId})
      //password checking is gonna be jwt.compare tho
      const authorized = thirdparty.password == password
      if (authorized){
      //change completed to true
      }
      throw new Error('Wrong password')
     }
     if(isbuyer.choosen){
      //check if the password matches with the buyer password else throw error 'wrong password'
      const buyer = await users.findOne({_id:userId})
      //password checking is gonna be jwt.compare tho
      const authorized = buyer.password == password
      if (authorized){
      //change completed to true
      }
      throw new Error('Wrong password')
     }
     throw new Error('This is not the password of the receiver')

    } catch (err) {
       next(err) 
    }
}

module.exports = {verifyPickup,pickupMethod,deliveryMethod }