const express = require("express");
const route = express.Router();
const {getUsers,getMessages} = require("../Controller/OtherControl/Info")

route.route("/getusers/:id").get(getUsers);
route.route("/getmessages/:id").get(getMessages);

module.exports = route;