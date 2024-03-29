let taskName=""
document.addEventListener('DOMContentLoaded', function () {
    const coverDiv=document.getElementById('coverDiv');
    coverDiv.style.display='block';
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

function goToAddSticker(){
    const urlStr=window.location.href;
    const url=new URL(urlStr);
    const taskId=url.searchParams.get("taskId");
    window.location.replace(`./reward-sticker.html?taskId=${taskId}`)
}

function goToHome(){
    window.location.replace(`./main-senior.html`)
}


