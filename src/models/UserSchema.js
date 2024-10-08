const mongoose = require('mongoose');
const schema = mongoose.Schema;

const messageSchema = new mongoose.Schema({
    from: String,
    to: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
    read:Boolean,
});
const noteSchema = new mongoose.Schema({
    note: String,
    username: String,
    pic: String,
    accept: { type: Boolean, required: false },  // Optional field
    reject: { type: Boolean, required: false } 
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
    required: function() {
      return !this.googleId; // Require password only if googleId is not present
}},
googleId: { 
    type: String,
    unique: true,  // Must be unique for OAuth users
    sparse: true,  // Allows multiple users to have `null` googleId (for regular users)
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