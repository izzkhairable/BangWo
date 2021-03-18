function getProfile() {
	return "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg";
}

function getLogo() {
	return "https://4m4you.com/wp-content/uploads/2020/06/logo-placeholder.png";
}

document.addEventListener('DOMContentLoaded', function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (!user) {
                window.location.replace('./loginORsignUpStep1.html');
				
        } 
		getElderlyProfile(user.uid).then((msg) => {
			var welcome_message = 'Welcome, ' + msg.name;
			var profilePicUrl=msg.profilePicUrl;
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

