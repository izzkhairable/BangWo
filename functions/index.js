/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { user } = require("firebase-functions/lib/providers/auth");
const { ExportBundleInfo } = require("firebase-functions/lib/providers/analytics");
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
  const volunteerId = data.volunteerId;
  
  const returnTaskName = firestore
      .collection("task")
      .doc(taskId)
      .set({
        taskId: taskId,
        taskName: taskName,
        elderlyId: elderlyId,
        volunteerId: volunteerId
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
          const returnTaskAddress = await task
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
        const returnStatus = await task
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

// Get task details
exports.getTaskDetails = functions.https.onCall(async(data) => {
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);

  const returnTaskDetails = await task
    .get()
    .then((doc) => {
      if(doc.exists) {
        return doc.data();
      } else {
          console.log("The task does not exist");
      }
    })
    .catch((error) => {
      console.log("Error retrieving task details, task may not exist", error);
    })
  return returnTaskDetails;
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

// Volunteer retrieves elderly profile
exports.getElderlyProfile = functions.https.onCall(async(data) => {
  const uid = data.uid;
  const elderlyUsers = firestore.collection("elderlyUsers").doc(uid);

  const returnElderlyProfile = await elderlyUsers
    .get()
    .then((doc) => {
      if(doc.exists) {
        const result = doc.data();
        return {
          name: result.name, 
          phoneNo: result.phoneNo,
          profilePicUrl: result.profilePicUrl
        }
      } else {
          console.log("Elderly does not exist");
      }
    })
    .catch((error) => {
      console.log("Error retrieving elderly profile", error);
    })
  return returnElderlyProfile;
})

// Volunteer accepts task success
exports.acceptTask = functions.https.onCall(async(data) => {
  const volunteerId = data.volunteerId;
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);

  const accepted = await task
    .get()
    .then((doc) => {
      return doc;
    })
    .then(async(doc) => {
      if(doc.exists) {
        const accepting = await task
          .update({
            volunteerId: volunteerId
          })
          .then(() => {
            return "Yay! We found you a volunteer! (VolunteerId successfully updated to task)";
          })
          .catch((error) => {
            console.error("Error accepting task ", error);
            return "Error accepting task";
          });
        return accepting;
      } 
    })
    .catch((error) => {
      console.log("Error getting task, task may not have been created before.", error);
    })
  return accepted;
})

// Unable to find volunteer after 30 seconds
// exports.noVolunteer = functions.https.onCall(async(data) => {
//   const currentTime = Date.now();
//   const taskId = data.taskId;
//   const task = firestore.collection("task").doc(uid);
//   const volunteerId = data.volunteerId;

//   const waiting = await task 
//     .get()
//     .then((doc) => {
//       const nextTime = Date.now();
//       if (nextTime - currentTime >= 30000) { // 30 seconds, able to change
//         console.log("We couldn't find you a volunteer");
//         return "We couldn't find you a volunteer";
//       } 
//     })
//   return waiting;
// })

// Volunteer arrives, task in progress
exports.taskInProgress = functions.https.onCall(async(data) => {
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);
  const volunteerId = data.volunteerId;

  const inProgress = await task
    .get()
    .then((doc) => {
      return doc;
    })
    .then(async(doc) => {
      if(doc.exists) {
        const arriving = await task
          .update({
            status: "In Progress"
            //volunteerId: volunteerId
          })
          .then(() => {
            return "Volunteer Help In Progress (Volunteer has successfully reached destination)";
          })
          .catch((error) => {
            console.error("Error reaching destination ", error);
            return "Error reaching destination";
          });
        return arriving;
      }
    })
    .catch((error) => {
      console.log("Error changing status, task may not have been created before.", error);
    })
  return inProgress;
})

// Elderly give sticker
exports.addSticker = functions.https.onCall(async(data) => {
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);
  const volunteerId = data.volunteerId;
  const volunteer = firestore.collection("volunteerUsers").doc(volunteerId);

  const addSticker = await volunteer
    .get()
    .then((doc) => {
      return doc;
    })
    .then(async(doc) => {
      if(doc.exists) {
        // pull quantity of each sticker in to a variable
        const award = await volunteer
          .update({
            stickerMap: {
              stickerName: "verygood",
              quantity: 100
            }
          })
          .then(() => {
            console.log("You have given a verygood sticker!");
            return "You have given a verygood sticker!";
          })
          .catch((error) => {
            console.error("Error giving sticker ", error);
            return "Error giving sticker";
          })
        return award;
      }
    })
    .catch((error) => {
      console.log("Could not find sticker, perhaps sticker does not exist");
    })
  return addSticker;
})