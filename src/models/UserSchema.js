const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const noteSchema = new mongoose.Schema({
    note:String,
    accept:Boolean,
    reject:Boolean,
    username:String,
    pic:String
});
const buyOrsellOptions = new mongoose.Schema({
    options:String,
    choosen:Boolean
});
// const thirdOrSecondOptions = new mongoose.Schema({
//     options:String,
//     choosen:Boolean
// });
const offerOption = new mongoose.Schema({
    options:String,
    choosen:Boolean
});
const chatSchema = new mongoose.Schema({
    username:String,
    userId:String,
    socketId:String,
    messages:[messageSchema],
    read:Boolean,
    msgUnread:Number,
    profilePic:String,
})
const userTransaction = new mongoose.Schema({
    transactionWith:{
        username:String,
        pic:String
    },
    transactionToken:String,
    buyOrSell:[buyOrsellOptions],
    // thirdpartyInvite:String,optional
    deals:{
        // deliveryDate:Date,
        // amount:Number,
        // walletId:String,
        offer:[offerOption]
    },
    // thirdOrSecond:[thirdOrSecondOptions],optional
    completed:Boolean
    
})
const newusers = new schema({
email:{
    type: String,
    required: [true, 'Enter an email'],
    unique: true,
},
socketId:String,
username: String,
password: {
    type: String,
    required: [true, 'Enter a password'],
   
},
chats:[chatSchema],
balance:Number,
pending:Number,
profilePic:String,
inviteCode:String,
walletId:String,
notification:[noteSchema],
transaction:[userTransaction ]

})

module.exports = mongoose.model('User', newusers)