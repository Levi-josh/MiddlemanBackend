const {login,logout} = require('../Controller/AuthControl/Jwt')
const express = require("express");
const route = express.Router();

route.route("/login").post(login);
route.route("/logout/:id").get(logout);

module.exports = route;