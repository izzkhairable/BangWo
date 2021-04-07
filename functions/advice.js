const functions = require("firebase-functions");
const admin = require("firebase-admin");
const firestore = admin.firestore();


// sendAdvice
exports.sendAdvice = functions.https.onCall(async(data) => {
const elderlyId =  data.elderlyId;
const volunteerId = data.volunteerId;
const adviceId = elderlyId + volunteerId + Date.now().toString();
const title = data.title;
const description = data.description;

const adviceSent = firestore
        .collection("advice")
        .doc(adviceId)
        .set({
        elderlyId: elderlyId,
        volunteerId: volunteerId,
        adviceId: adviceId,
        title: title,
        description: description
        })
        .then(async (doc) => {
        return {
            msg: "You have successfully submitted an advice",
            status: 200,
            adviceData: {
            elderlyId: elderlyId,
            volunteerId: volunteerId,
            adviceId: adviceId,
            title: title,
            description: description
            },
        };
        });

    return adviceSent;
})

// Retrieve all advice past volunteers have submitted about an elderly user
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
        })
    return returnAdviceByElderly;   
})