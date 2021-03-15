const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();

exports.checkAccountType = functions.https.onCall(async (data) => {
  const uid=data.uid;
  console.log("This is UID", uid);
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
