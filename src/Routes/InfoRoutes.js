const express = require("express");
const route = express.Router();
const upload = require('../Utils/Multer')
const {getUsers,getMessages,postPfp} = require("../Controller/OtherControl/Info")

route.route("/getusers/:id").get(getUsers);
route.route("/getmessages/:id1/:id2").get(getMessages);
route.route("/getNft").post(upload.single('image'),postPfp);

module.exports = route;