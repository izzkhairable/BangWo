const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
exports.signUpElderly = require("./signUpElderly");
exports.signUpVolunteer = require("./signUpVolunteer");
exports.tasks = require("./tasks");
exports.checkAccountType=require("./checkAccountType");
exports.stickers = require("./stickers");
<<<<<<< HEAD
exports.chats = require("./chats");
=======


>>>>>>> 03db89f95a82dff2ef6e573f03c3381df3e09223
