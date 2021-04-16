document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            alert("You are not logged in. Redirecting to sign up page....")
            window.location.replace('./Login/loginORsignUpStep1.html');
            return
        }else{

            getElderlyProfile(user.uid).then((msg) => {
                var name=msg.name;
                var profilePicUrl=msg.profilePicUrl;
                var address=msg.address;
                if(name==null || profilePicUrl==null || address==null || !name || !profilePicUrl || !address){
                    alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
                    window.location.replace('./Login/loginORsignUpStep1.html');
                    return
                }
            })
            const urlStr=window.location.href;
            const url=new URL(urlStr);
            const taskName=url.searchParams.get("taskname");
            createTaskStep1(user.uid,taskName);
        } 
    });
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

async function createTaskStep1(elderlyId, taskName) {
    const createTaskStep1FB = firebase
        .functions()
        .httpsCallable('tasks-createTaskStep1');
    let resultData = '';
    await createTaskStep1FB ({
        taskName: taskName,
        elderlyId: elderlyId,
    }).then((result) => {
        const taskId= result.data.taskData.taskId;
        const aAtHome=document.getElementById('aAtHome');
        const aNotHome=document.getElementById('aNotHome');
        aAtHome.setAttribute("href", `./at-home.html?taskId=${taskId}`)
        aNotHome.setAttribute("href", `./not-at-home.html?taskId=${taskId}`)
    });
    console.log(resultData)
    return resultData;
}

function goBack() {
    window.history.back();
  }