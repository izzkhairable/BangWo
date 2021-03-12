/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();

// This API will check if the elderly is existing one or not
// If it is a new user, would be specified in the return message
// Also, new user would be redirected to input step 2
exports.loginORsignUpElderlyStep1 = functions.https.onCall((data) => {
  const uid = data.uid;
  const phoneNo = data.phoneNo;
  const user = firestore.collection("elderlyUsers").doc(uid);
  const returnData = user
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const finalMsg={
            status: 200,
            msg: "You are an existing user",
            isPreviouslyUser: true,
            isSignUpCompleted: Boolean(doc.data().address),
            profileData: data,
          };
          return finalMsg;
        } else {
          const newUserReturnData = firestore
              .collection("elderlyUsers")
              .doc(uid)
              .set({
                elderlyId: uid,
                phoneNo: phoneNo,
              })
              .then(() => {
                const finalMsg={
                  status: 200,
                  msg: "You are new elderly user, your (Auto-Generated)UID and PhoneNo added to our database",
                  isPreviouslyUser: false,
                  isSignUpCompleted: false,
                  profileData: {
                    elderlyId: uid,
                    PhoneNo: phoneNo,
                  },
                };
                return finalMsg;
              });
          return newUserReturnData;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  return returnData;
});

// This is the second step of signing up
// The elderly is have to insert their name and upload their profile picture
exports.signUpElderlyStep2 = functions.https.onCall(async (data) => {
  const uid = data.uid;
  const name = data.name;
  const profilePicUrl = data.profilePicUrl;
  const user = firestore.collection("elderlyUsers").doc(uid);

  const status = await user
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const returnStatus = await user
              .update({
                name: name,
                profilePicUrl: profilePicUrl,
              })
              .then(() => {
                return "Document successfully updated!";
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
                return "Error updating document: ";
              });
          return returnStatus;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  const updatedData = await user
      .get()
      .then((doc) => {
        return doc.data();
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  return {
    status: 200,
    msg: status,
    profileData: updatedData,
  };
});

// The last step of signing up
// for the elderly home address and unit no to be captured
exports.signUpElderlyStep3 = functions.https.onCall(async (data) => {
  const uid = data.uid;
  const address = data.address;
  const unitNo = data.unitNo;
  const user = firestore.collection("elderlyUsers").doc(uid);

  const status = await user
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const returnStatus = await user
              .update({
                address: address,
                unitNo: unitNo,
              })
              .then(() => {
                return "Document successfully updated!";
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
                return "Error updating document: ";
              });
          return returnStatus;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  const updatedData = await user
      .get()
      .then((doc) => {
        return doc.data();
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  return {
    status: 200,
    msg: status,
    profileData: updatedData,
  };
});

// This API will check if the volunteer is existing one or not
// If it is a new user, would be specified in the return message
// Also, new volunteer would be redirected to input step 2
exports.loginORsignUpVolunteerStep1 = functions.https.onCall((data) => {
  const uid = data.uid;
  const phoneNo = data.phoneNo;
  const user = firestore.collection("volunteerUsers").doc(uid);
  const returnData = user
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          const finalMsg={
            status: 200,
            msg: "You are an existing volunteer user",
            isPreviouslyUser: true,
            isSignUpCompleted: Boolean(doc.data().address),
            profileData: data,
          };
          return finalMsg;
        } else {
          const newUserReturnData = firestore
              .collection("volunteerUsers")
              .doc(uid)
              .set({
                elderlyId: uid,
                phoneNo: phoneNo,
              })
              .then(() => {
                const finalMsg={
                  status: 200,
                  msg: "You are new volunteer user, your (Auto-Generated)UID and PhoneNo added to our database",
                  isPreviouslyUser: false,
                  isSignUpCompleted: false,
                  profileData: {
                    volunteerId: uid,
                    PhoneNo: phoneNo,
                  },
                };
                return finalMsg;
              });
          return newUserReturnData;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  return returnData;
});

// This is the second step of signing up for volunteer
// The volunteer is have to insert their name and upload their profile picture
exports.signUpVolunteerStep2 = functions.https.onCall(async (data) => {
  const uid = data.uid;
  const name = data.name;
  const profilePicUrl = data.profilePicUrl;
  const user = firestore.collection("volunteerUsers").doc(uid);

  const status = await user
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const returnStatus = await user
              .update({
                name: name,
                profilePicUrl: profilePicUrl,
              })
              .then(() => {
                return "Document successfully updated!";
              })
              .catch((error) => {
                console.error("Error updating document: ", error);
                return "Error updating document: ";
              });
          return returnStatus;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  const updatedData = await user
      .get()
      .then((doc) => {
        return doc.data();
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  return {
    status: 200,
    msg: status,
    profileData: updatedData,
  };
});
