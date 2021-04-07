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
        getAvailableTasks()

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
    console.log(resultData.data[0])
    msg=resultData.data[0]
    document.getElementById("taskName").innerText=msg.taskName
    document.getElementById("taskDescription").innerText=msg.taskDescription
    document.getElementById("img1").remove();
    document.getElementById("img2").remove();

    const later=`<div class="card bg-creme border-dark image rounder w-25 m-2 p-2">
    <img class="taskImages" src="../assets/images/placeholder.svg" class="p-2" />
</div>`
    const imgUrls= msg.taskPhotoUrls
    for(img of imgUrls){
        console.log("Image url",img)
        document.getElementById("photoMainDiv").innerHTML=document.getElementById("photoMainDiv").innerHTML+`<div class="card bg-creme border-dark image rounder w-25 m-2 p-2">
        <img class="taskImages" src="${img}" class="p-2" />
    </div>` 
    }
    return;
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
