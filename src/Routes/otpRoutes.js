const express = require("express");
const route = express.Router();
const {sendOtp,verifyOtp}=require('../Controller/AuthControl/Otp')

route.route('/send-otp').post(sendOtp)
route.route('/verify-otp').put(verifyOtp)

module.exports = route;