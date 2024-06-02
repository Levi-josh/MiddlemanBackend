const mongoose = require('mongoose');
const schema = mongoose.Schema;


const otpusers = new schema({
email:String,
otp:String,
createdAt: { type: Date, default: Date.now },
password:String,

})

module.exports = mongoose.model('Otpusers', otpusers)