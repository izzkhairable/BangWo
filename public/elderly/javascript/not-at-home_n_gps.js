document.addEventListener('DOMContentLoaded', function () {
    var perf = firebase.performance();



    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
            alert("You are not logged in. Redirecting to sign up page....")
            window.location.replace('./Testing/loginORsignUpStep1.html');
            return
        }else{

            getElderlyProfile(user.uid).then((msg) => {
                var name=msg.name;
                var profilePicUrl=msg.profilePicUrl;
                var address=msg.address;
                var unitNo=msg.unitNo;
                if(name==null || profilePicUrl==null || address==null || !name || !profilePicUrl || !address){
                    alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
                    window.location.replace('./Testing/loginORsignUpStep1.html');
                    return
                }

            });
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

function displayMap(){
    const currentAddress=document.getElementById('currentAddress').value;
    const url=`https://www.google.com/maps/embed/v1/place?key=AIzaSyBUcwKDHwnPlhLlJBZCNulc-abORf42qdA&q=${currentAddress.split(" ").join("+")},Singapore`
    const iframeEl=document.getElementById("iframeEl");
    console.log(url)
    iframeEl.src=url
}

async function createTaskStep2B() {
    const createTaskStep2FB = firebase
        .functions()
        .httpsCallable('tasks-createTaskStep2');

    const urlStr=window.location.href;
    const url=new URL(urlStr);
    const taskId=url.searchParams.get("taskId");
    const address=document.getElementById("currentAddress").value;
    const unitNo=document.getElementById("unitNo").value;

    await createTaskStep2FB ({
        taskId: taskId,
        address: address,
        unitNo: unitNo
    }).then((result) => {
        console.log(result)
        // window.location.replace(`./createNewTaskStep3.html?taskId=${taskId}`)
    });
    return
}
