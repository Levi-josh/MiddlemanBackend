const mongoose = require('mongoose');
const schema = mongoose.Schema;


const otpusers = new schema({
email:String,
otp:String,
createdAt: { type: Date, default: Date.now },
password: {
    type: String,
    required: [true, 'Enter a password'],
    minlength: [6, 'password must be more than 6 characters'],
    maxlength:[7,'password must not exceed 6 characters'] 
},

})

module.exports = mongoose.model('Otpusers', otpusers)