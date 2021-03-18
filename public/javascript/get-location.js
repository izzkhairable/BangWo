document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./loginORsignUpStep1.html'); 
                return
        }else{
            const urlStr=window.location.href;
            const url=new URL(urlStr);
            const taskName=url.searchParams.get("taskname");
            createTaskStep1(user.uid,taskName);
            document.getElementById("header-text").innerHTML = "You at home ah?";
        } 
    });
});

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
        aAtHome.setAttribute("href", `./createNewTaskStep2A.html?taskId=${taskId}`)
        aNotHome.setAttribute("href", `./createNewTaskStep2B.html?taskId=${taskId}`)
    });
    console.log(resultData)
    return resultData;
}