document.addEventListener('DOMContentLoaded',async function () {

    

    await firebase.auth().onAuthStateChanged(async function (user) {
        if (!user) {
                window.location.replace('./loginORsignUpStep1.html'); 
                return
        }
        const urlStr=window.location.href;
        const url=new URL(urlStr);
        const taskId=url.searchParams.get("taskId");
       const data=await getTaskDetails(taskId);
        await getVolunteerDetails(data)
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
         resultData=result.data

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
        resultData=result
    });
    console.log(resultData)
    return resultData;
}

async function getVolunteerDetails(data){
    const getVolunteerDetailsFB = firebase
    .functions()
    .httpsCallable('volunteerProfile-getVolunteerProfile');
    getVolunteerDetailsFB({
        volunteerId: data.data.volunteerId
    }).then((data)=>{
        console.log("Volunteer data", data)
        document.getElementById('volunteerName').innerText=data.data.name
        document.getElementById('volunteerOccupation').innerText=data.data.occupation
        document.getElementById('volunteerProfilePic').src=data.data.profilePicUrl
    })
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
