const { authCallback,passportAuth,jwtAuth} = require('../Controller/AuthControl/Oauth')
const express = require("express");
const route = express.Router();

route.route("/auth/google/callback").get(authCallback,jwtAuth);
route.route("/auth/google").get(passportAuth);

module.exports = route;