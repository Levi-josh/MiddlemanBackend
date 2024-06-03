const express = require("express");
const route = express.Router();
const {sendOtp,verifyOtp}=require('../Controller/AuthControl/Otp')

route.route('/signup').post(sendOtp)
route.route('/verify-otp').post(verifyOtp)

module.exports = route;