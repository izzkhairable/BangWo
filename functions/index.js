/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { user } = require("firebase-functions/lib/providers/auth");
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

// Elderly mainpage: Choose Task Category (Name) --> Step 1
exports.addTaskName = functions.https.onCall(async (data) => {
  const taskId = Date.now().toString() + data.elderlyId;
  const taskName = data.taskName;
  const elderlyId = data.elderlyId;
  
  const returnTaskName = firestore
      .collection("task")
      .doc(taskId)
      .set({
        taskId: taskId,
        taskName: taskName,
        elderlyId: elderlyId
      })
      .then(async(doc) => {
        console.log({
          msg: "Task has been created with Task Category (Name)",
          status: 200
        })
        return "Task has been created with Task Category (Name)";
      })
  
  return returnTaskName;
})

// Add task address and unit no--> Step 2
exports.addTaskAddress = functions.https.onCall(async(data) => {
  const taskId = data.taskId;
  const address = data.address;
  const unitNo = data.unitNo;
  const task = firestore.collection("task").doc(taskId);

  const status = await task
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async(doc) => {
        if (doc.exists) {
          const returnTaskAddress = await user
            .update({
              address: address,
              unitNo: unitNo,
            })
            .then(() => {
              return "Task address and unit number has been added";
            })
            .catch((error) => {
              console.error("Error updating task address and unit no: ", error);
              return "Error updating task address and unit no";
            });
          return returnTaskAddress;
        }
      }) 
      .catch(error => {
        console.log("There is no such task that has been created yet: ", error);
      }) 
  
  const updatedTask = await task
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
    profileData: updatedTask,
  };
})

// Add task name, description and photos
exports.addTaskDetails = functions.https.onCall(async(data) => {
  const taskId = data.taskId;
  const taskDescription = data.taskDescription;
  const taskPhotoUrl = data.taskPhotoUrl;
  const task = firestore.collection("task").doc(taskId);

  const status = await task
    .get()
    .then((doc) => {
      return doc;
    })
    .then(async(doc) => {
      if(doc.exists) {
        const returnStatus = await user
          .update({
            taskDescription: taskDescription,
            taskPhotoUrl: taskPhotoUrl
          })
          .then(() => {
            return "Successfully updated task with task description and photo";
          })
          .catch((error) => {
            console.error("Error updating task with description and/or photo ", error);
            return "Error updating task with description and/or photo";
          });
        return returnStatus;
      }
    })
    .catch((error) => {
      console.log("Error getting task, task may not have been created before.", error);
    })
  return status;
})


// Elderly mainpage: Create task (One-time update, not in figma)
exports.addNewTask = functions.https.onCall(async (data, context) => {
  // Unique taskId generator
  const taskId = new Date().toString(); + data.elderlyId;
  const taskName = data.taskName;
  const taskDescription = data.taskDescription;
  const taskPhotoUrl = data.taskPhotoUrl;
  const elderlyId = data.elderlyId;
  const volunteerId = data.volunteerId;
  const address = data.address;
  const unitNo = data.unitNo;

  const returnTask = firestore
      .collection("task")
      .doc(taskId)
      .set({
        address: address,
        elderlyId: elderlyId,
        taskDescription: taskDescription,
        taskId: taskId,
        taskName: taskName,
        taskPhotoUrl: taskPhotoUrl,
        unitNo: unitNo,
        volunteerId: volunteerId,
      })
      .then(async (doc) => {
        console.log({
          msg: "Task has been created",
          status: 200,
        });
        return "Task has been created";
      });
  return returnTask;     
});

// User Mainpage
// exports.addNewTask = functions.https.onCall(async (data, context) => {
//   const taskId = data.UID;
//   const taskName = taskName;
//   const taskDescription = taskDescription;
//   const user = firestore.collection("elderlyUsers").doc(uid);

//   const returnTask = firestore
//       .collection("task")
//       .doc(UID)
//       .set({
//         taskId = taskId,
//         taskName = taskName,
//         taskDescription = taskDescription,
//         user = elderlyId,
        
//       })
//       .then(async (doc) => {
//         console.log({
//           msg: "Task has been created",
//           status: 200,
//         });
//       });
//   return returnTask;     
// });

// // Get Location Page (Not at home)
// exports.addNewTaskLocationNotAtHome = functions.https.onCall(async (data, context) => {
//   const taskId = taskId;
//   const user = firestore.collection("elderlyUsers").doc(uid);
//   const address = data.address;
//   const unitNo = data.unitNo;
//   const postalCode = data.postalCode;
  
//   const task = await user
//       .get()
//       .then((doc) => { // if task exists from above
//         return doc;
//       })
//       .then(async (doc) => {
//         if (doc.exists) {
//           const returnTask = await user
//             .update({ // set address as follows
//               address: address,
//               unitNo: unitNo,
//               postalCode: postalCode,
//             })
//             .then(() => {
//               console.log("address, unitNo and postalCode updated!")
//               return "address, unitNo and postalCode updated!";
//             });
//           return returnTask;
//         }
//       })
//       .catch((error) => {
//         console.log("Error getting task document: ", error);
//       });    
// });

// // Get Location Page (At home)
// exports.addNewTaskLocationAtHome = functions.https.onCall(async (data, context) => {
//   const taskId = taskId;
//   const user = firestore.collection("elderlyUsers").doc(uid);
//   const address = firestore.collection("elderlyUsers").doc(address);
//   const unitNo = firestore.collection("elderlyUsers").doc(unitNo);
//   //const postalCode = firestore.collection("elderlyUsers").doc(postalCode); 
//   // -> no postal code field for elderlyUsers currently
  
//   const task = await user
//       .get()
//       .then((doc) => { // if task exists from above
//         return doc;
//       })
//       .then(async (doc) => {
//         if (doc.exists) {
//           const returnTask = await user
//             .update({ // set address as follows
//               address: address,
//               unitNo: unitNo,
//               //postalCode: postalCode,
//             })
//             .then(() => {
//               console.log("You're at home, this is your address")
//               return "You're at home, this is your address";
//             });
//           return returnTask;
//         }
//       })
//       .catch((error) => {
//         console.log("Error getting task document: ", error);
//       });       
// });

// // Add new task description (todo)
// exports.addNewTaskDescription = functions.https.onCall(async (data, context) => {
//   const taskId = taskId;
//   const taskName = taskName;
//   const taskDescription = taskDescription;
//   const taskPhotoUrl = taskPhotoUrl;
//   const user = firestore.collection("elderlyUsers").doc(uid);
//   const volunteer = firestore.collection("volunteerUsers").doc(uid); // 
//   const address = data.address;
//   const unitNo = data.unitNo;
//   const postalCode = data.postalCode;
  
  

//   const returnTask = firestore
//       .collection("task")
//       .doc(UID)
//       .set({
//         taskId = taskId,
//         taskName = taskName,
//         taskDescription = taskDescription,
//         taskPhotoUrl = taskPhotoUrl,
//         user = elderlyId,
//         volunteer = volunteerId,
//         address = address,
//         unitNo = unitNo,
//         postalCode = postalCode,
//       })
//       .then(async (doc) => {
//         console.log({
//           msg: "Task has been created",
//           status: 200,
//         });
//       });
//   return returnTask;     
// });
