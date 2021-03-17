function getName() {
	return "Katrisa Feona";
}

function getProfile() {
	return "https://thumbs.dreamstime.com/b/default-avatar-photo-placeholder-profile-icon-eps-file-easy-to-edit-default-avatar-photo-placeholder-profile-icon-124557887.jpg";
}

function getLogo() {
	return "https://4m4you.com/wp-content/uploads/2020/06/logo-placeholder.png";
}


	
var welcome_message = 'Welcome, ' + getName();
document.getElementById("welcome").innerHTML = welcome_message;

document.getElementById("profile").src = getProfile(); 

document.getElementById("logo").src = getLogo();