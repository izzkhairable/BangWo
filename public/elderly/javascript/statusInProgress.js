document.addEventListener('DOMContentLoaded', function () {

    

    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./loginORsignUpStep1.html'); 
                return
        }
        const urlStr=window.location.href;
        const url=new URL(urlStr);
        const taskId=url.searchParams.get("taskId");
        getTaskDetails(taskId);
    });

    setInterval(async function() {
        const urlStr=window.location.href;
        const url=new URL(urlStr);
        const taskId=url.searchParams.get("taskId");
        const task=await getTaskStatus(taskId)
        console.log("Task data",task)
        if(task.data.taskStatus!="inProgress"){
            window.location.replace('./statusCompleted.html?taskId='+taskId); 
        }
    }, 1000);
});

async function getTaskDetails(taskId) {
    const getTaskDetailsFB = firebase
        .functions()
        .httpsCallable('tasks-getTaskDetails');
    let resultData = '';
    await getTaskDetailsFB({
        taskId: taskId,
    }).then((result) => {
        console.log(result)
        const taskDetailsContainer=document.getElementById("taskDetailsContainer")
        const resultData=result.data
        for(label in resultData){
            taskDetailsContainer.innerHTML=taskDetailsContainer.innerHTML+`<p>${label}: ${resultData[label]}</p>`
        }

        var address=result.data.address;
        const iframeEl=document.getElementById("iframeEl");
        const url=`https://www.google.com/maps/embed/v1/place?key=AIzaSyBUcwKDHwnPlhLlJBZCNulc-abORf42qdA&q=${address.split(" ").join("+")},Singapore`
        console.log(url);
        iframeEl.src=url;
    });
    console.log(resultData)
    return resultData;
}

async function getTaskStatus(taskId) {
    const getTaskDetailsFB = firebase
        .functions()
        .httpsCallable('tasks-getTaskDetails');
    let resultData = '';
    await getTaskDetailsFB({
        taskId: taskId,
    }).then((result) => {
        resultData=result
    });
    return resultData;
}
