const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();
/* eslint-disable max-len */

/**
 * The First step of creating a new task adding the taskName to the Firestore collection
 * @param {string} taskName - The name of the task select e.g. changing light bulb
 * @param {string} elderlyId - The unique id of the elderly user, each uid is unique regardless of user type.
 * @returns {object} - An object containing response msg, status and task data sent
 */
exports.createTaskStep1 = functions.https.onCall(async (data)s => {
  const taskId = Date.now().toString() +"-"+data.elderlyId;
  const taskName = data.taskName;
  const elderlyId = data.elderlyId;

  const returnTaskData = await firestore
      .collection("task")
      .doc(taskId)
      .set({
        taskId: taskId,
        taskName: taskName,
        elderlyId: elderlyId,
        volunteerId: null,
      })
      .then(async () => {
        return {
          msg: `Task has been created with Task Name: ${taskName}`,
          status: 200,
          taskData: {
            taskId: taskId,
            taskName: taskName,
            elderlyId: elderlyId,
            volunteerId: null,
          },
        };
      });
  return returnTaskData;
});

/**
 * The Second step of creating a new task adding the address & unitNo to the Firestore collection
 * @param {string} taskId - The unique id of the current task, taskId is unique combination of (dateTimeTaskCreated-ElderlyId)
 * @param {string} address - The address of the elderly current location
 * @param {string} unitNo -  The unit number of the elderly current location
 * @returns {object} - An object containing response msg, status and task data updated on Firebases
 */
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
                return `Task address:${address} and unit number:${unitNo} has been added`;
              })
              .catch((error) => {
                console.error(`Error updating task address:${address} and unit no:${unitNo}  `, error);
                return "Error updating task address and unit no";
              });
          return returnTaskAddress;
        }
      })
      .catch((error) => {
        console.log("Task doesn't exist based on the task id provided: ", error);
      });

  const updatedTask = await task
      .get()
      .then((doc) => {
        return doc.data();
      })
      .catch((error) => {
        console.log("Error getting the newly updated task:", error);
      });

  return {
    status: 200,
    msg: status,
    profileData: updatedTask,
  };
});

/**
 * The Third/last step of creating a new task adding the taskDescription & taskPhotoUrl to the Firestore collection
 * @param {string} taskId - The unique id of the current task, taskId is unique combination of (dateTimeTaskCreated-ElderlyId)
 * @param {string} taskDescription - The description of the task
 * @param {string} taskPhotoUrls -  The img url of the photos relating to the task that is already uploaded to Firebase storage
 * @returns {string} - The string contain status of updating the task data to Firebase
 */
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

/**
 * The Third/last step of creating a new task adding the taskName, taskDescription & taskPhotoUrl to the Firestore collection
 * The function is invoked when the elderly user selected "Help with other task", giving them the ability to define they own task name
 * @param {string} taskId - The unique id of the current task, taskId is unique combination of (dateTimeTaskCreated-ElderlyId)
 * @param {string} taskName - The name of the task
 * @param {string} taskDescription - The description of the task
 * @param {string} taskPhotoUrls -  The img url of the photos relating to the task that is already uploaded to Firebase storage
 * @returns {string} - The string contain status of updating the task data to Firebase
 */
exports.createTaskStep3wName = functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const taskName = data.taskName;
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

/**
 * Get the task details from Firestore by taskId
 * @param {string} taskId - The unique id of the current task, taskId is unique combination of (dateTimeTaskCreated-ElderlyId)
 * @returns {object} - The object containing the full task details
 */
exports.getTaskDetails = functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);
  const returnTaskDetails = await task
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        } else {
          console.log(`Task doesn't exist based on the task id ${taskId} provided`);
          return {
            msg: `Task doesn't exist based on the task id ${taskId} provided`
          }
        }
      })
      .catch((error) => {
        console.log(`Error retrieving task details for task id ${taskId}, task may not exist`, error);
        return {
          msg: `Error retrieving task details for task id ${taskId}, task may not exist`,
          error: error
        }
      });
  return returnTaskDetails;
});

/**
 * Get the elderly full profile from Firestore to be displayed on the volunteer side
 * @param {string} elderlyId - The unique id of the elderly user, each uid is unique regardless of user type.
 * @returns {object} - The object containing the full elderly profile
 */
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
          console.log(`Elderly does not exist with elderlyId:${elderlyId} provided`);
          return {
            msg: `Elderly does not exist with elderlyId:${elderlyId} provided`
          }
        }
      })
      .catch((error) => {
        console.log(`Error retrieving elderly profile ${elderlyId}`, error);
        return {
          msg: `Error retrieving elderly profile ${elderlyId}`,
          error: error
        }
      });
  return returnElderlyProfile;
});

/**
 * When the volunteer accepts a task this function would be invoke to update the status of the task to accepted
 * @param {string} volunteerId - The unique id of the volunteer user, each uid is unique regardless of user type.
 * @param {string} taskId - The unique id of the current task, taskId is unique combination of (dateTimeTaskCreated-ElderlyId)
 * @returns {string} The string contains the status of updating the task to accepted
 */
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
                return `Task status for ${taskId} successfully updated to accepted`;
              })
              .catch((error) => {
                console.error(`Error updating task status for ${taskId} to accepted`, error);
                return `Error accepting task ${taskId}`, error;
              });
          return accepting;
        }
      })
      .catch((error) => {
        console.log(
            `Error updating task status for ${taskId} to accepted, task may not have been created before.`,
            error,
        );
        return `Error updating task status for ${taskId} to accepted, task may not have been created before.`,error
      });
  return accepted;
});

/**
 * When the volunteer selects that they have arrived this function would be invoke to update the status of the task to inProgress
 * @param {string} taskId - The unique id of the current task, taskId is unique combination of (dateTimeTaskCreated-ElderlyId)
 * @returns {string} The string contains the status of updating the task to inProgress
 */
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
                taskStatus: "inProgress",
              })
              .then(() => {
                return "Volunteer Help In Progress (Volunteer has successfully reached destination)";
              })
              .catch((error) => {
                  console.error(`Error updating task status for ${taskId} to inProgress`, error);
                  return `Error updating task to inProgress for task ${taskId}`, error;
              });
          return arriving;
        }
      })
      .catch((error) => {
          console.log(
            `Error updating task status for ${taskId} to inProgress, task may not have been created before.`,
            error,
        );
        return `Error updating task status for ${taskId} to inProgress, task may not have been created before.`,error
      });
  return inProgress;
});

/**
 * When the volunteer selects that the task have been completed a task this function would be invoke to update the status of the task to completed
 * @param {string} taskId - The unique id of the current task, taskId is unique combination of (dateTimeTaskCreated-ElderlyId)
 * @returns {string} The string contains the status of updating the task to completed
 */
exports.taskCompleted = functions.https.onCall(async (data) => {
  const taskId = data.taskId;
  const task = firestore.collection("task").doc(taskId);
  const endTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString();

  const completed = await task
      .get()
      .then((doc) => {
        return doc;
      })
      .then(async (doc) => {
        if (doc.exists) {
          const completing = await task
              .update({
                taskStatus: "completed",
                endTime: endTime,
              })
              .then(() => {
                return "Yay! Task completed!";
              })
              .catch((error) => {
                console.error(`Error updating task status for ${taskId} to completed`, error);
                return `Error updating task to completed for task ${taskId}`, error;
            });
          return completing;
        }
      })
      .catch((error) => {
        console.log(
          `Error updating task status for ${taskId} to completed, task may not have been created before.`,
          error,
      );
      return `Error updating task status for ${taskId} to completed, task may not have been created before.`,error
      });
  return completed;
});

/**
 * Get all of the task with status "finding" to be displayed on the volunteer side for the volunteer to accept the task
 * @returns {object} an array of object containing task details for tasks with status "finding"
 */
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
        console.log("Error retrieving tasks", error);
      });
  return returnAvailableTasks;
});

