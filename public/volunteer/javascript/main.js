let isCalled=false;
// request permission on page load
document.addEventListener('DOMContentLoaded', function() {

     firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./Testing/loginORsignUpStep1.html');
				alert("You are not logged in. Redirecting to sign up page....")
        }
		getVolunteerProfile(user.uid).then((msg) => {
            console.log(msg.name)
            var name=msg.name;
			var welcome_message = 'Welcome, ' + name;
			var profilePicUrl=msg.profilePicUrl;
            if(name==null || profilePicUrl==null || !name || !profilePicUrl){
                window.location.replace('./Testing/loginORsignUpStep1.html');
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
        if(isCalled===false){
            notifyMe()
            isCalled=true
        }
        window.location.replace('./main-got-task.html');
    }
    console.log(resultData)
    return resultData;
}
   
   
function notifyMe() {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
       }
       if (Notification.permission !== 'granted')
        Notification.requestPermission();
    var notification = new Notification('Notification title', {
    icon: '../../assets/images/logo.svg',
    body: 'Hey an elderly is in need of your help!',
    });
    notification.onclick = function() {
    window.open('./main-got-task.html');
    };
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