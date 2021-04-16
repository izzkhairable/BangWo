/* eslint-disable max-len */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();

/**
 * Volunteer who has completed task with the elderly could post new advice to future volunteers only once they have successfully helped the elderly
 * @param {string} elderlyId - The unique ID for each elderly.
 * @param {string} volunteerId - The unique id of the volunteer.
 * @param {string} title - The title of the new advice.
 * @param {string} description - The description of the advice.
 * @returns {object} An object containing reponse msg, status and advice data sent
 */
exports.sendAdvice = functions.https.onCall(async (data) => {
  const elderlyId = data.elderlyId;
  const volunteerId = data.volunteerId;
  const title = data.title;
  const description = data.description;
  const adviceId = elderlyId + volunteerId + Date.now().toString();

  const adviceSent =await firestore
      .collection("advice")
      .doc(adviceId)
      .set({
        elderlyId: elderlyId,
        volunteerId: volunteerId,
        adviceId: adviceId,
        title: title,
        description: description,
      })
      .then(async () => {
        return {
          msg: "You have successfully submitted an advice",
          status: 200,
          adviceData: {
            elderlyId: elderlyId,
            volunteerId: volunteerId,
            adviceId: adviceId,
            title: title,
            description: description,
          },
        };
      });

  return adviceSent;
});

/**
 * Retrieving past advices inputted for a specific elderly
 * @param {string} elderlyId - The unique ID for each elderly.
 * @returns {object} An array of objects each objects represents the advices
 */
exports.getAdviceByElderly = functions.https.onCall(async (data) => {
  const elderlyId = data.elderlyId;
  const advices = firestore.collection("advice").where("elderlyId", "==", elderlyId);
  const result = [];

  const returnAdviceByElderly = await advices
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, "=>", doc.data());
          result.push(doc.data());
        });
        return result;
      })
      .catch((error) => {
        console.log("Error retrieving this elderly's advice", error);
      });
  return returnAdviceByElderly;
});
