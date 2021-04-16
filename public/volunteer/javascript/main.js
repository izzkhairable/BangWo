document.addEventListener('DOMContentLoaded', function() {

     firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./Login/loginORsignUpStep1.html');
				alert("You are not logged in. Redirecting to sign up page....")
        }
		getVolunteerProfile(user.uid).then((msg) => {
            console.log(msg.name)
            var name=msg.name;
			var welcome_message = 'Welcome, ' + name;
			var profilePicUrl=msg.profilePicUrl;
            if(name==null || profilePicUrl==null || !name || !profilePicUrl){
                window.location.replace('./Login/loginORsignUpStep1.html');
				alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
            }
			document.getElementById("welcome").innerHTML = welcome_message;
			document.getElementById("profile").src = profilePicUrl;
			return msg.name
		});
        setInterval(async function() {
            getAvailableTasks()
        }, 1000);
    });
});

async function getAvailableTasks() {
    const getAvailableTasksFB = firebase
        .functions()
        .httpsCallable('tasks-getAvailableTasks');
    let resultData = '';
    await getAvailableTasksFB ().then((result) => {
        resultData=result
    })
    console.log(resultData.data.length)
    if(resultData.data.length>0){
        const taskId=resultData.data.taskId
        window.location.replace('./main-got-task.html?taskId='+taskId);
    }
    console.log(resultData)
    return resultData;
}
   
async function getVolunteerProfile(uid) {
const getVolunteerProfileFB = firebase
    .functions()
    .httpsCallable('volunteerProfile-getVolunteerProfile');
let msg = '';
await getVolunteerProfileFB({
    volunteerId: uid,
}).then((result) => {
    msg = result.data;
    console.log(msg)
});
return msg;
}