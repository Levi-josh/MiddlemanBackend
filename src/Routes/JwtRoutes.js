
const express = require("express");
const route = express.Router();
const {login,logout,checkAuth} = require('../Controller/AuthControl/Jwt')

route.route("/sigin").post(login);
route.route("/logout/:id").get(logout);
route.route("/auth/verify").get(checkAuth);

module.exports = route;