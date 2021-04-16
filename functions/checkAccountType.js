/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();

/**
 * The function purpose is to check the type of volunteer in Firestore collection
 * In the frontend, if the user is a volunteer and attempts to login as an elderly would be redirected to the volunteer page(vice versa)
 * @param {string} uid - The unique id of the user, each uid is unique regardless of user type
 * @returns {string} The type of volunteer (elderly, volunteer or none)
 */
exports.checkAccountType = functions.https.onCall(async (data) => {
  const uid=data.uid;
  const volunteer= firestore.collection("volunteerUsers").doc(uid);
  const elderly= firestore.collection("elderlyUsers").doc(uid);

  const isVolunteer=await volunteer
      .get()
      .then((doc) => {
        if (doc.data()) {
          return true;
        } else {
          return false;
        }
      });

  if (!isVolunteer) {
    const isElderly=await elderly
        .get()
        .then((doc)=>{
          if (doc.data()) {
            return true;
          } else {
            return false;
          }
        });

    if (isElderly) {
      return "elderly";
    } else {
      return "none";
    }
  } else {
    return "volunteer";
  }
});
