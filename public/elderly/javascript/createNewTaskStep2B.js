document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./loginORsignUpStep1.html'); 
                return
        }
    });
});

async function createTaskStep2B() {
    const createTaskStep2FB = firebase
        .functions()
        .httpsCallable('tasks-createTaskStep2');

    const urlStr=window.location.href;
    const url=new URL(urlStr);
    const taskId=url.searchParams.get("taskId");
    const address=document.getElementById("addressInput").value;
    const unitNo=document.getElementById("unitNoInput").value;

    await createTaskStep2FB ({
        taskId: taskId,
        address: address,
        unitNo: unitNo
    }).then((result) => {
        console.log(result)
        window.location.replace(`./createNewTaskStep3.html?taskId=${taskId}`)
    });
    return
}


