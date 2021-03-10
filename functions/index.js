/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore = admin.firestore();

exports.addNewUserPhone = functions.https.onCall((data, context) => {
  const UID = data.uid;
  const phoneNo = data.phoneNo;
  const user = firestore.collection("elderlyUsers").doc(UID);
  const returnData = user
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          console.log({
            profileData: data,
            status: "200",
            msg: "You are an existing user!",
            isPreviouslyUser: true,
            isSignUpCompleted: Boolean(doc.data().address),
          });

          return {
            profileData: data,
            status: "200",
            msg: "You are an existing user!",
            isPreviouslyUser: true,
            isSignUpCompleted: Boolean(doc.data().address),
          };
        } else {
          const newUserReturnData = firestore
              .collection("elderlyUsers")
              .doc(UID)
              .set({
                uid: UID,
                phoneNo: phoneNo,
              })
              .then(() => {
                console.log( {
                  msg: "You are new user, your UID and PhoneNo added to our database",
                  status: 200,
                  isPreviouslyUser: false,
                  profileData: {
                    UID: UID,
                    PhoneNo: phoneNo,
                  },
                });

                return {
                  msg: "You are new user, your UID and PhoneNo added to our database",
                  status: 200,
                  isPreviouslyUser: false,
                  profileData: {
                    UID: UID,
                    PhoneNo: phoneNo,
                  },
                };
              });
          return newUserReturnData;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  return returnData;
});

exports.addNewUserFinalStep = functions.https.onCall(async (data, context) => {
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
                console.log("Document successfully updated!");
                // result="Document successfully updated!";
                return "Document successfully updated!";
              })
              .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
                // result="Error updating document: ";
                return "Error updating document: ";
              });
          return returnStatus;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  const updateData = await user
      .get()
      .then((doc) => {
        return doc.data();
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  return {status: status, profileData: updateData};
});


exports.addNewUserAddress = functions.https.onCall(async (data, context) => {
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
                console.log("Document successfully updated!");
                // result="Document successfully updated!";
                return "Document successfully updated!";
              })
              .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
                // result="Error updating document: ";
                return "Error updating document: ";
              });
          return returnStatus;
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  const updateData = await user
      .get()
      .then((doc) => {
        return doc.data();
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });

  return {status: status, profileData: updateData};
});
