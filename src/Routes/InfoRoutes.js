const express = require("express");
const route = express.Router();
const upload = require('../Utils/Multer')
const {getUsers,getMessages,postPfp,getNotification,getHistory,getCustomers,getChats} = require("../Controller/OtherControl/Info")

route.route("/getusers/:id").get(getUsers);
route.route("/getNotes/:id").get(getNotification);
route.route("/getHistory/:id").get(getHistory);
route.route("/getChats/:id").get(getChats);
route.route("/getCustom/:id").get(getCustomers);
route.route("/getmessages/:id1/:id2").get(getMessages);
route.route("/getPfp").post(upload.single('image'),postPfp);

module.exports = route;