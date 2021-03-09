/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const firestore=admin.firestore();

exports.addNewUserPhone=functions.https.onCall((data, context)=>{
  const UID=data.uid;
  const phoneNo= data.phoneNo;
  const user=firestore.collection("elderlyUsers").doc(UID);
  const returnData = user.get().then((doc) => {
    if (doc.exists) {
      console.log({
        msg: "You are an existing user!",
        isPreviouslyUser: true,
        status: 200,
        UID: UID,
        PhoneNo: phoneNo,
      });

      return {
        msg: "You are an existing user!",
        isPreviouslyUser: "true",
        status: 200,
        UID: UID,
        PhoneNo: phoneNo,
      };
    } else {
      const newUserReturnData= firestore.collection("elderlyUsers").doc(UID).set({
        uid: UID,
        phoneNo: phoneNo,
      }).then(()=>{
        console.log({
          msg: "You are new user, your UID and PhoneNo added to our database",
          isPreviouslyUser: false,
          status: 200,
          UID: UID,
          PhoneNo: phoneNo,
        });

        return {
          msg: "You are new user, your UID and PhoneNo added to our database",
          isPreviouslyUser: "false",
          status: 200,
          UID: UID,
          PhoneNo: phoneNo,
        };
      });
      return newUserReturnData;
    }
  }).catch((error) => {
    console.log("Error getting document:", error);
  });

  return returnData;
});

exports.addNewUserFinalStep=functions.https.onCall(async (data, context) =>{
  const uid=data.uid;
  const name=data.name;
  const profilePicUrl = data.profilePicUrl;
  const user=firestore.collection("elderlyUsers").doc(uid);

  const status = await user.get()
      .then( (doc) => {
        return doc;
      }).then(async (doc)=>{
        if (doc.exists) {
          const returnStatus= await user.update({
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
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

  const updateData= await user.get()
      .then( (doc) => {
        return doc.data();
      }).catch((error) => {
        console.log("Error getting document:", error);
      });

  return {status: status, profileData: updateData};
});


