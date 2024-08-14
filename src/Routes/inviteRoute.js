const express = require("express");
const route = express.Router();
const {searchInvite,rejectInvite,acceptInvite,sendInvite} = require('../Controller/TransactControl/Invite')

route.route("/searchInvite/:id").get(searchInvite);
route.route("/rejectInvite/:id1/:id2").put(rejectInvite);
route.route("/acceptInvite/:id1/:id2").put(acceptInvite);
route.route("/sendInvite").post(sendInvite);

module.exports = route;