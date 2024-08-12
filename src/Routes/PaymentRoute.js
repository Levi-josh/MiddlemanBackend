const express = require("express");
const route = express.Router();
const {makePayment,searchWallet,deposit} = require('../Controller/TransactControl/Payment')
route.route("/searchRecepient/:id").get(searchWallet);
route.route("/makePayment").post(makePayment);
route.route("/deposit").post(deposit);

module.exports = route;