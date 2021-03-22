const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();



// Messages
// One glaring problem is that each message has its own document --> scaling problem in future
// because I could not store message objects which contain other fields in the "chat" collection
// But maybe for this project's demonstration it will be okay as we are not graded based on code
exports.sendMessage = functions.https.onCall(async(data) => {
  const messageId = Date.now().toString() + "-" + data.senderId;
  const senderId = data.senderId; // elderlyId
  const receiverId = data.receiverId; // volunteerId
  const messageText = data.messageText;
  const timestamp = Date.now();

  const messageSent = firestore
        .collection("messages")
        .doc(messageId)
        .set({
          messageId: messageId,
          senderId: senderId,
          receiverId: receiverId,
          messageText: messageText,
          timestamp: timestamp
        })
        .then(async (doc) => {
          return {
            msg: "Message has been created",
            status: 200,
            messageData: {
              messageId: messageId,
              senderId: senderId,
              receiverId: receiverId,
              messageText: messageText,
              timestamp: timestamp
            },
          };
        });

    return messageSent;
})