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
                taskStatus: "finding",
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

// Add task name, description and photos
exports.createTaskStep3wName = functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const taskDescription = data.taskDescription;
  const taskPhotoUrls = data.taskPhotoUrls;
  const taskName = data.taskName;
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
                taskName: taskName,
                taskStatus: "finding",
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
  const taskId = new Date().toString() + data.elderlyId;
  const taskName = data.taskName;
  const taskDescription = data.taskDescription;
  const taskPhotoUrl = data.taskPhotoUrl;
  const elderlyId = data.elderlyId;
  const volunteerId = data.volunteerId;
  const address = data.address;
  const unitNo = data.unitNo;
  const taskStatus = data.taskStatus;
  // 2021-04-07
  const date = new Date().getFullYear().toString + "-" + new Date().getMonth().toString + "-" + new Date().getDate().toString();
  // e.g 14:00
  const startTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
  const endTime = data.endTime;

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
        taskStatus: taskStatus,
        date: date,
        startTime: startTime,
        endTime: endTime,
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
          return result;
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
                taskStatus: "accepted",
                volunteerId: volunteerId,
                startTime: new Date().getHours().toString() + ":" + new Date().getMinutes().toString(),
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

  const inProgress = await task
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const arriving = await task
              .update({
                status: "inProgress",
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

// Task completed
exports.taskCompleted = functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);
  const endTime = new Date().getHours().toString() + "-" + new Date().getMinutes().toString();

  const completed = await task
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const completing = await task
              .update({
                status: "completed",
                endTime: endTime,
              })
              .then(() => {
                return "Yay! Task completed!";
              })
              .catch((error) => {
                console.error("Error completing task ", error);
                return "Error completing task";
              });
          return completing;
        }
      })
      .catch((error) => {
        console.log(
            "Error completing task, task may not exist in the first place",
            error,
        );
      });
  return completed;
});

// Retrieve all tasks that are currently unfulfilled (i.e. not work in progress and not completed)
exports.getAvailableTasks = functions.https.onCall(async (data) => {
  const taskStatus = "finding";
  const tasks = firestore.collection("task").where("taskStatus", "==", taskStatus);
  const result = [];

  const returnAvailableTasks = await tasks
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          result.push(doc.data());
        });
        return result;
      })
      .catch((error) => {
        console.log("Error retrieving task", error);
      });
  return returnAvailableTasks;
});

