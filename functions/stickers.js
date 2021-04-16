const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();
/* eslint-disable max-len */

/**
 * Add sticker to an array of stickers in the volunteer user profile in Firebase
 * @param {string} volunteerId - The unique id of the volunteer user, each uid is unique regardless of user type.
 * @param {string} stickerName - The name of the sticker to be added to volunteer user profile
 * @returns {object} An object containing response status an updated array of the volunteer stickers
 */
exports.addSticker = functions.https.onCall(async (data) => {
  const volunteerId = data.volunteerId;
  const stickerName=data.stickerName;
  const volunteer = firestore.collection("volunteerUsers").doc(volunteerId);
  const addSticker = await volunteer
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          const award = await volunteer.get().then((doc)=>{
            console.log(doc.data());
            let stickers=[];
            if (doc.data().stickers) {
              stickers=doc.data().stickers;
            }
            stickers.push(stickerName);
            volunteer.update({
              stickers: stickers,
            })
                .then(() => {
                  console.log(`Volunteer successfully awarded the ${stickerName} sticker!`);
                  return {
                    status: 200,
                    msg: stickers,
                  };
                })
                .catch((error) => {
                  console.error(`Error giving the ${stickerName} sticker`, error);
                  return `Error giving the ${stickerName} sticker`;
                });
          }).catch((error)=>{
            console.error(`Error giving the ${stickerName} sticker`, error);
            return `Error giving the ${stickerName} sticker`;
          });
          return award;
        }
      })
      .catch((error) => {
        console.error(`Error giving the ${stickerName} sticker`, error);
        return `Error giving the ${stickerName} sticker`;
      });
  return addSticker;
});

/**
 * Get all sticker from Firebase by volunteerId
 * @param {string} volunteerId - The unique id of the volunteer user, each uid is unique regardless of user type.
 * @returns {object} An object containing volunteer stickers
 */
exports.getStickersByVolunteer = functions.https.onCall(async (data) => {
  const volunteerId = data.volunteerId;
  const volunteer = firestore.collection("volunteerUsers").doc(volunteerId);
  const returnStickersByVolunteer = await volunteer
      .get()
      .then((doc) => {
        if (doc.exists) {
          const result = doc.data();
          return {
            stickers: result.stickers,
          };
        } else {
          console.log("Volunteer has no stickers yet!");
          return "Volunteer has no stickers yet!";
        }
      })
      .catch((error) => {
        console.log("Error retrieving volunteer stickers", error);
        return "Error retrieving volunteer stickers";
      });
  return returnStickersByVolunteer;
});
