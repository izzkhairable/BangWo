const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();
/* eslint-disable max-len */

// Elderly mainpage: Choose Task Category (Name) --> Step 1
exports.createTaskStep1 = functions.https.onCall(async (data) => {
  const taskId = Date.now().toString() +"-"+data.elderlyId;
  const taskName = data.taskName;
  const elderlyId = data.elderlyId;
  const volunteerId = null;

  const returnTaskData = firestore
      .collection("task")
      .doc(taskId)
      .set({
        taskId: taskId,
        taskName: taskName,
        elderlyId: elderlyId,
        volunteerId: volunteerId,
      })
      .then(async (doc) => {
        return {
          msg: "Task has been created with Task Category (Name)",
          status: 200,
          taskData: {
            taskId: taskId,
            taskName: taskName,
            elderlyId: elderlyId,
            volunteerId: volunteerId,
          },
        };
      });
  return returnTaskData;
});

// Add task address and unit no--> Step 2
exports.createTaskStep2= functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const address = data.address;
  const unitNo = data.unitNo;
  const task = firestore.collection("task").doc(taskId);

  const status = await task
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
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
      .catch((error) => {
        console.log("There is no such task that has been created yet: ", error);
      });

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
});

// Add task name, description and photos
exports.createTaskStep3 = functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const taskDescription = data.taskDescription;
  const taskPhotoUrls = data.taskPhotoUrls;
  const task = firestore.collection("task").doc(taskId);

  const status = await task
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const returnStatus = await task
              .update({
                taskDescription: taskDescription,
                taskPhotoUrls: taskPhotoUrls,
              })
              .then(() => {
                return "Successfully updated task with task description and photo";
              })
              .catch((error) => {
                console.error(
                    "Error updating task with description and/or photo ",
                    error,
                );
                return "Error updating task with description and/or photo";
              });
          return returnStatus;
        }
      })
      .catch((error) => {
        console.log(
            "Error getting task, task may not have been created before.",
            error,
        );
      });
  return status;
});

// Get task details
exports.getTaskDetails = functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);

  const returnTaskDetails = await task
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log("The task does not exist");
        }
      })
      .catch((error) => {
        console.log("Error retrieving task details, task may not exist", error);
      });
  return returnTaskDetails;
});

// Elderly mainpage: Create task (One-time update, not in figma)
exports.addNewTask = functions.https.onCall(async (data, context) => {
  // Unique taskId generator
  const taskId = new Date().toString();
  +data.elderlyId;
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
exports.getElderlyProfile = functions.https.onCall(async (data) => {
  const elderlyId = data.elderlyId;
  const elderlyUsers = firestore.collection("elderlyUsers").doc(elderlyId);

  const returnElderlyProfile = await elderlyUsers
      .get()
      .then((doc) => {
        if (doc.exists) {
          const result = doc.data();
          return {
            name: result.name,
            phoneNo: result.phoneNo,
            profilePicUrl: result.profilePicUrl,
            address: result.address,
            unitNo: result.unitNo,
          };
        } else {
          console.log("Elderly does not exist");
        }
      })
      .catch((error) => {
        console.log("Error retrieving elderly profile", error);
      });
  return returnElderlyProfile;
});

// Volunteer accepts task success
exports.acceptTask = functions.https.onCall(async (data) => {
  const volunteerId = data.volunteerId;
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);

  const accepted = await task
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const accepting = await task
              .update({
                volunteerId: volunteerId,
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
        console.log(
            "Error getting task, task may not have been created before.",
            error,
        );
      });
  return accepted;
});

// Volunteer arrives, task in progress
exports.taskInProgress = functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);
  // const volunteerId = data.volunteerId;

  const inProgress = await task
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const arriving = await task
              .update({
                status: "In Progress",
                // volunteerId: volunteerId
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
        console.log(
            "Error changing status, task may not have been created before.",
            error,
        );
      });
  return inProgress;
});
