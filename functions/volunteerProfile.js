/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();

/**
 * Get the full volunteer profile from Firestore by volunteerId
 * @param {string} volunteerId - The unique id of the volunteer user, each uid is unique regardless of user type.
 * @returns {object} The object containing full elderly profile
 */
exports.getVolunteerProfile = functions.https.onCall(async (data) => {
  const volunteerId = data.volunteerId;
  const volunteerUsers = firestore.collection("volunteerUsers").doc(volunteerId);
  const returnVolunteerProfile = await volunteerUsers
      .get()
      .then((doc) => {
        if (doc.exists) {
          const result = doc.data();
          return result;
        } else {
          console.log(`Volunteer with ${volunteerId} does not exist`);
          return {
            msg: `Volunteer with ${volunteerId} does not exist`,
          };
        }
      })
      .catch((error) => {
        console.log("Error retrieving volunteer profile", error);
        return {
          msg: `Error retrieving volunteer profile with volunteer id ${volunteerId}`,
          error: error,
        };
      });
  return returnVolunteerProfile;
});

/**
 * Get the task completed by volunteer for the profile page from Firestore by volunteerId
 * @param {string} volunteerId - The unique id of the volunteer user, each uid is unique regardless of user type.
 * @returns {object} An array of object containing task details
 */
exports.getCompletedTasksByVolunteer = functions.https.onCall(async (data) => {
  const volunteerId = data.volunteerId;
  const completedTasks = firestore.collection("task").where("taskStatus", "==", "completed").where("volunteerId", "==", volunteerId);
  const result = [];
  const returnCompletedTasksByVolunteer = await completedTasks
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          result.push(doc.data());
        });
        return result;
      })
      .catch((error) => {
        console.log("Error retrieving volunteer profile", error);
      });
  return returnCompletedTasksByVolunteer;
});
