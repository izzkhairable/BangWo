/* eslint-disable max-len */
const admin = require("firebase-admin");
admin.initializeApp();

/**
 * The main function file that will invoke other functions in other files
 * To any function in the various files just simply fileName-nameOfFunction e.g. advice-getAdviceByElderly
 */
exports.signUpElderly = require("./signUpElderly");
exports.signUpVolunteer = require("./signUpVolunteer");
exports.volunteerProfile = require("./volunteerProfile");
exports.checkAccountType=require("./checkAccountType");
exports.tasks = require("./tasks");
exports.stickers = require("./stickers");
exports.advice = require("./advice");

