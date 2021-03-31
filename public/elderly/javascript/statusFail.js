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
        // for(label in resultData){
        // //     taskDetailsContainer.innerHTML=taskDetailsContainer.innerHTML+`<p>${label}: ${resultData[label]}</p>`    
        // console.log(label);
        // }
        taskDetailsContainer.innerHTML=`
        <h4 class="mb-3">Task: ${resultData.taskName}</h4>
        <p><b>Comments:</b> ${resultData.taskDescription}</p>
        <p><b>Your Address:</b> ${resultData.address}</p>
        `
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
