document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./Login/loginORsignUpStep1.html');
				alert("You are not logged in. Redirecting to sign up page....")
        }
		getElderlyProfile(user.uid).then((msg) => {
            var name=msg.name;
			var welcome_message = 'Welcome, ' + name;
			var profilePicUrl=msg.profilePicUrl;
            var address=msg.address;
            if(name==null || profilePicUrl==null || address==null || !name || !profilePicUrl || !address){
                window.location.replace('./Login/loginORsignUpStep1.html');
				alert("Your sign up is not completed, Pls complete it. Redirecting to sign up page....")
            }
			document.getElementById("welcome").innerHTML = welcome_message;
			document.getElementById("profile").src = profilePicUrl;
			return msg.name
		});
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

