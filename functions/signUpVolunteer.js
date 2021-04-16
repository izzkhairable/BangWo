const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();
/* eslint-disable max-len */

/**
 * Acts as a sign up and login function all-in-one & adds volunteer user UID & Phone Number to the Firestore collection.
 * @param {string} uid - The unique id of the volunteer user, each uid is unique regardless of user type.
 * @param {string} phoneNo - The phoneNo of the volunteer user
 * @returns {object} An object containing reponse msg, status and volunteer user data sent
 */
exports.loginORsignUpStep1 = functions.https.onCall((data) => {
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
                volunteerId: uid,
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

/**
 * For the second step/last step of the signup all-in-one & adds volunteer user name, profilePicUrl to the Firestore collection by volunteer uid.
 * @param {string} uid - The unique id of the volunteer user, each uid is unique regardless of user type.
 * @param {string} name - The name of volunteer user
 * @param {string} profilePicUrl - The profilePicUrl which is the url of the image uploaded to Firebase storage
 * @returns {object} An object containing reponse msg, status and volunteer user data sent
 */
exports.signUpStep2 = functions.https.onCall(async (data) => {
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


