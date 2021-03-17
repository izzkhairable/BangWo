const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();
/* eslint-disable max-len */

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