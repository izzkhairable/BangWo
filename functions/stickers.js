const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();
/* eslint-disable max-len */

// Elderly give sticker
exports.addSticker = functions.https.onCall(async (data) => {
  const volunteerId = data.volunteerId;
  const stickerName=data.stickerName;
  const volunteer = firestore.collection("volunteerUsers").doc(volunteerId);
  const addSticker = await volunteer
      .get()
      .then(async (doc) => {
        if (doc.exists) {
          // pull quantity of each sticker in to a variable
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
                  console.log("You have given a verygood sticker!");
                  return {
                    status: 200,
                    msg: stickers,
                  };
                })
                .catch((error) => {
                  console.error("Error giving sticker ", error);
                  return "Error giving sticker";
                });
          }).catch((err)=>{
            console.error("Error giving sticker ");
            return "Error giving sticker";
          });
          return award;
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Could not find sticker, perhaps sticker does not exist");
      });
  return addSticker;
});
