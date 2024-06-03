const otpUsers = require('../../models/otpUsers')
const users = require('../../models/UserSchema')
const transporter = require('../../Middleware/Nodemailer')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const sendOtp = async (req, res,next) => {
    const { email,password} = req.body;
    // Generate a 6-digit OTP
    let otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Send OTP to the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Verification',
      text: `Your OTP is: ${otp}`,
    }
    try {
    // Store the OTP and email in the database
    const otpData = {
    email,
    otp,
    createdAt: new Date(),
    password,
    };   
    const user = await otpUsers.findOne({email})
    if(user){
      await otpUsers.updateOne({email},{$set:{otp}})
      await otpUsers.updateOne({email},{$set:{createdAt:Date.now()}})
    }
    else{
    // Insert the OTP data into the database
    const result= await otpUsers.create(otpData)
    }
    // Send the OTP email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent to email.' });
    } catch (err) {
    next(err);
    // res.status(500).json({ message: 'Failed to send OTP.' });
    }};
    // Route to verify OTP
const verifyOtp = async (req, res,next) => {
    const { otp } = req.body;
    try {
      // Retrieve the stored OTP for the email from the database
      const otpData = await otpUsers.findOne({otp});
      console.log(otpData)
      const salt = await bcrypt.genSalt()
      const hash = await bcrypt.hash(otpData.password, salt)
      console.log(hash)
      if (!otpData) {
        throw new Error('No user found')
      }
      // Check if the OTP is expired (valid for 10 minutes)
      const otpAge = new Date() - otpData.createdAt;
      const maxOtpAge = 10 * 60 * 1000; // 10 minutes
      console.log(otpAge )
      console.log(maxOtpAge)
      if (otpAge > maxOtpAge) {
        throw new Error('OTP expired.')
      }
 
      // Register the user

      const userData = {
        email:otpData.email,
        socketId:'',
        username:'',
        password:hash,
        chats:[],
        balance:1000,
        pending:0,
        profilePic:'',
        inviteCode:'',
        walletId:'',
        notification:[],
        history:[],
        };
      const newUser = await users.create(userData)
      // OTP is valid, so respond with success and delete the OTP entry from the database
      await otpUsers.deleteOne({ otp: otpData.otp });
      const newjwt = jwt.sign({ _id: newUser._id }, process.env.Access_Token, { expiresIn: '2 days' })
      res.status(200).json({'Accesss_Token':newjwt,'UserId':newUser._id})
    } catch (err) {
      next(err);
    //   res.status(500).json({ message: 'Failed to verify OTP.' });
    }
  };

    module.exports = {sendOtp,verifyOtp}