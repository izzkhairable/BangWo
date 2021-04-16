const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();

/* eslint-disable max-len */

/**
 * Acts as a sign up and login function all-in-one & adds elderly user UID & Phone Number to the Firestore collection.
 * @param {string} uid - The unique id of the elderly user, each uid is unique regardless of user type.
 * @param {string} phoneNo - The phoneNo of the elderly user
 * @returns {object} An object containing reponse msg, status and elderly user data sent
 */
exports.loginORsignUpStep1 = functions.https.onCall((data) => {
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
          const newUserReturnData =firestore
              .collection("elderlyUsers")
              .doc(uid)
              .set({
                elderlyId: uid,
                phoneNo: phoneNo,
              })
              .then(() => {
                const finalMsg={
                  status: 200,
                  msg: "You are new elderly user, your (Auto-Generated) UID and PhoneNo added to our database",
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
        return {status: 400, msg: error.toString()};
      });
  return returnData;
});


/**
 * For the second step of the signup all-in-one & adds elderly user name, profilePicUrl to the Firestore collection by elderly uid.
 * @param {string} uid - The unique id of the elderly user, each uid is unique regardless of user type.
 * @param {string} name - The name of elderly user
 * @param {string} profilePicUrl - The profilePicUrl which is the url of the image uplodated to Firebase storage
 * @returns {object} An object containing reponse msg, status and eldelry user data sent
 */
exports.signUpStep2 = functions.https.onCall(async (data) => {
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


/**
 * For the third/last step of the signup all-in-one & adds elderly user address & unit number Firestore collection by elderly uid.
 * @param {string} uid - The unique id of the elderly user, each uid is unique regardless of user type.
 * @param {string} address- The address of elderly user
 * @param {string} unitNo - The unitNo of elderly user
 * @returns {object} An object containing reponse msg, status and elderly user data sent
 */
exports.signUpStep3 = functions.https.onCall(async (data) => {
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
