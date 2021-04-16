let taskName=""
let imageCount=0
document.addEventListener('DOMContentLoaded', function () {
    const coverDiv=document.getElementById('coverDiv');
    coverDiv.style.display='block';
    var perf = firebase.performance();
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            alert("You are not logged in. Redirecting to sign up page....")
            window.location.replace('./Login/loginORsignUpStep1.html');
            return
        }else{
            getElderlyProfile(user.uid).then(async (msg) => {
                var name=msg.name;
                var profilePicUrl=msg.profilePicUrl;
                var address=msg.address;
                if(name==null || profilePicUrl==null || address==null || !name || !profilePicUrl || !address){
                    alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
                    window.location.replace('./Login/loginORsignUpStep1.html');
                    return
                }
            });
        } 
    });
    coverDiv.style.display='none';
});

async function getElderlyProfile(uid) {
    const getElderlyProfileFB = firebase
        .functions()
        .httpsCallable('tasks-getElderlyProfile');
    let msg = '';
    await getElderlyProfileFB({
        elderlyId: uid,
    }).then((result) => {
        msg = result.data;
		console.log(msg)
    });
    return msg;
}

function stickerSelected(stickerName){
    const stickerDisplay=document.getElementById("sticker-display")
    stickerDisplay.innerHTML=stickerName
}

async function addSticker(){
    const coverDiv=document.getElementById('coverDiv');
    coverDiv.style.display='block';
    const stickerName=document.getElementById('sticker-display').innerText;
    if(stickerName=="Select Sticker"){
        const noSelectAlert= document.getElementById('no-select-alert')
        noSelectAlert.classList.remove("d-none")
        return
    }
    const addStickerFB= firebase
    .functions()
    .httpsCallable('stickers-addSticker');
    let msg = '';
    await addStickerFB({
        volunteerId:"eWw8fBFekngLN242Ai6DbNLWLRj1",
        stickerName: stickerName
    }).then((result) => {
        msg = result.data;
        console.log(msg)
        const urlStr=window.location.href;
        const url=new URL(urlStr);
        const taskId=url.searchParams.get("taskId");
        const coverDiv=document.getElementById('coverDiv');
        coverDiv.style.display='none';
        window.location.replace('./stickerRewarded.html?taskId'+taskId);
    });
    return msg;
}



