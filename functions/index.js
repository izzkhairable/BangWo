const admin = require("firebase-admin");
const { user } = require("firebase-functions/lib/providers/auth");
const { ExportBundleInfo } = require("firebase-functions/lib/providers/analytics");
admin.initializeApp();
exports.signUpElderly = require("./signUpElderly");
exports.signUpVolunteer = require("./signUpVolunteer");
exports.tasks = require("./tasks");
exports.checkAccountType=require("./checkAccountType");
exports.stickers = require("./tasks")
