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
                var unitNo=msg.unitNo;
                if(name==null || profilePicUrl==null || address==null || !name || !profilePicUrl || !address){
                    alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
                    window.location.replace('./Login/loginORsignUpStep1.html');
                    return
                }
                const taskNameInput=document.getElementById('allTaskName');
                const urlStr=window.location.href;
                const url=new URL(urlStr);
                const taskId=url.searchParams.get("taskId");
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
    let stickerId= stickerName.split (" ").join("-")
    const stickerDiv=document.getElementById(stickerId)
    const stickersDiv=document.getElementsByClassName("sticker")

    for(sticker of stickersDiv){
        if(sticker.classList.contains("border-danger")){
            sticker.classList.remove("border-danger")
            sticker.classList.remove("border-5")
            sticker.classList.add("border-dark")
        }
    }

    if(stickerDiv.classList.contains("border-danger")){
        stickerDiv.classList.remove("border-danger")
        stickerDiv.classList.remove("border-5")
        stickerDiv.classList.add("border-dark")
    }else{
        stickerDiv.classList.remove("border-dark")
        stickerDiv.classList.add("border-danger")
        stickerDiv.classList.add("border-5")
    }  
    const stickerDisplay=document.getElementById("sticker-display")
    stickerDisplay.innerHTML=stickerName

}

async function addSticker(){
    const stickersDiv=document.getElementsByClassName("sticker")
    let stickerName
    for(sticker of stickersDiv){
        if(sticker.classList.contains("border-danger")){
            stickerName=sticker.id.split('-').join(' ')
        }
    }
    if(stickerName==null){
        const noSelectAlert= document.getElementById('no-select-alert')
        noSelectAlert.classList.remove("d-none")
        return
    }

    const addStickerFB= firebase
    .functions()
    .httpsCallable('stickers-addSticker');
    let msg = '';
    await addStickerFB({
        volunteerId:"zmETkZXqo2SwqwyGXD4sG9hHUSh2",
        stickerName: stickerName
    }).then((result) => {
        msg = result.data;
        console.log(msg)
        window.location.replace('./stickerRewarded.html');
    });
    return msg;
}



