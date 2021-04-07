/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();

// Volunteers retrieves own profile
exports.getVolunteerProfile = functions.https.onCall(async (data) => {
  const volunteerId = data.volunteerId;
  const volunteerUsers = firestore.collection("volunteerUsers").doc(volunteerId);

  const returnVolunteerProfile = await volunteerUsers
      .get()
      .then((doc) => {
        if (doc.exists) {
          const result = doc.data();
          return {
            name: result.name,
            volunteerId: result.volunteerId,
            stickers: result.stickers,
            profilePicUrl: result.profilePicUrl,
          };
        } else {
          console.log("Volunteer does not exist");
        }
      })
      .catch((error) => {
        console.log("Error retrieving volunteer profile", error);
      });
  return returnVolunteerProfile;
});

// Retrieve all tasks volunteer has completed
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

// Retrieve all tasks volunteer has completed
exports.getNumCompletedTasksByVolunteer = functions.https.onCall(async (data) => {
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
        return result.length;
      })
      .catch((error) => {
        console.log("Error retrieving volunteer profile", error);
      });
  return returnCompletedTasksByVolunteer;
});
