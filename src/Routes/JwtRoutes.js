
const express = require("express");
const route = express.Router();
const {login,logout} = require('../Controller/AuthControl/Jwt')

route.route("/sigin").post(login);
route.route("/logout/:id").get(logout);

module.exports = route;