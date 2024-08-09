const express = require("express");
const route = express.Router();
const {searchInvite,rejectInvite,acceptInvite,sendInvite} = require('../Controller/TransactControl/Invite')

route.route("/searchInvite/:id").get(searchInvite);
route.route("/rejectInvite").put(rejectInvite);
route.route("/acceptInvite").put(acceptInvite);
route.route("/sendInvite").post(sendInvite);

module.exports = route;