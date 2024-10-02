const express = require("express");
const route = express.Router();
const upload = require('../Utils/Multer')
const {getUsers,markAsRead,getMessages,postPfp,getNotification,getHistory,getCustomers,getChats} = require("../Controller/OtherControl/Info")

route.route("/getusers").get(getUsers);
route.route("/getNotes").get(getNotification);
route.route("/getHistory").get(getHistory);
route.route("/getChats").get(getChats);
route.route("/markAsRead").put(markAsRead);
route.route("/getCustom").get(getCustomers);
route.route("/getmessages/:id").get(getMessages);
route.route("/getPfp").post(upload.single('image'),postPfp);

module.exports = route;