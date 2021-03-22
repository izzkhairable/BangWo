const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();
exports.signUpElderly = require("./signUpElderly");
exports.signUpVolunteer = require("./signUpVolunteer");
exports.tasks = require("./tasks");
exports.checkAccountType=require("./checkAccountType");
exports.stickers = require("./stickers");


