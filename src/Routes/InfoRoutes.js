const express = require("express");
const route = express.Router();
const {getUsers} = require("../Controller/OtherControl/Info")

route.route("/getusers/:id").get(getUsers);

module.exports = route;