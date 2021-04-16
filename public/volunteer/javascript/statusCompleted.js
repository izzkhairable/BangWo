let isCalled=false;
let volunteerId;
document.addEventListener('DOMContentLoaded', async function() {

     firebase.auth().onAuthStateChanged(async function (user) {
        if (!user) {
                window.location.replace('./Login/loginORsignUpStep1.html');
				alert("You are not logged in. Redirecting to sign up page....")
        }
        const stickers=await getVolunteerStickers(user.uid).then((msg) => {
            volunteerId=user.uid
            console.log(msg)
            return msg
        });
        setInterval( async ()=>{
        
            await getVolunteerStickers(user.uid).then((msg) => {
                volunteerId=user.uid
                console.log(msg)
                if(msg.length>stickers.length){
                    console.log("Awarded New Stickers!")
                    if(document.getElementById('stickerName').innerText!="Sticker: "+stickers[stickers.length-1]){
                        document.getElementById('stickerName').innerText+=stickers[stickers.length-1]
                        $('#stickerModal').modal('show')
                    }
                }
            });

        },1000)
    });
});

function goToHome(){
    window.location.replace("./main.html")
}

async function getVolunteerStickers(uid) {
const getVolunteerProfileFB = firebase
    .functions()
    .httpsCallable('volunteerProfile-getVolunteerProfile');
let msg = '';
await getVolunteerProfileFB({
    volunteerId: uid,
}).then((result) => {
    msg = result.data.stickers
});
return msg;
}

