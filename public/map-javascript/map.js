document.addEventListener('DOMContentLoaded', async function () {
	await firebase.auth().onAuthStateChanged( async function (user) {
		 if (!user) {
				 window.location.replace('./Login/loginORsignUpStep1.html'); 
				 return
		 }
		 const urlStr=window.location.href;
		 const url=new URL(urlStr);
		 const taskId=url.searchParams.get("taskId");
		 document.getElementById('chatBtn').href='./chat.html?taskid='+taskId
		 const data=await getTaskDetails(taskId)
		 getElderlyDetails(data)
		getLocation()
		
	 });
 
 });


 async function getElderlyDetails(data){
    const getElderlyDetailsFB = firebase
    .functions()
    .httpsCallable('tasks-getElderlyProfile');
    getElderlyDetailsFB({
        elderlyId: data.data.elderlyId
    }).then((data)=>{
        console.log("Volunteer data", data)
        document.getElementById('elderlyName').innerText=data.data.name
        document.getElementById('elderlyAge').innerText="Age"+data.data.age
        document.getElementById('elderlyProfilePic').src=data.data.profilePicUrl
    })
}

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
        <p><b>Elderly Address:</b> ${resultData.address}</p>
        `
    	address=result.data.address;
        resultData=result
    });
    console.log(resultData)
    return resultData;
}

async function getTaskAddress(taskId) {
    const getTaskDetailsFB = firebase
        .functions()
        .httpsCallable('tasks-getTaskDetails');
    let resultData = '';
    await getTaskDetailsFB({
        taskId: taskId,
    }).then((result) => {
    	resultData=result.data.address;
    });
    console.log(resultData)
    return resultData;
}

function retrieveApiKey() {
	return "AIzaSyBUcwKDHwnPlhLlJBZCNulc-abORf42qdA";
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayMapDirections);

	} else {
		document.getElementById("map-display").innerHTML = "<h3>Geolocation is not supported by this browser.</h3>";
	}
}

async function displayMapDirections(user_location) {
	const urlStr=window.location.href;
	const pageurl=new URL(urlStr);
	const taskId=pageurl.searchParams.get("taskId");
	const address=await getTaskAddress(taskId)
	var url = "https://www.google.com/maps/embed/v1/directions";
	var api_key = "?key=" + retrieveApiKey();
	document.getElementById("map-display").setAttribute("src", url + api_key + `&origin=${user_location.coords.latitude},${user_location.coords.longitude}` +`&destination=${address},Singapore`);	
}

