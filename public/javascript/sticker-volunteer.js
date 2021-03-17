var message = "This sticker has been awarded by " + retrieveName() + " for your work.";
document.getElementById("sticker-heading").innerHTML = message;

function retrieveName() {
	//Currently just returns placeholder name User
	return "User";
}