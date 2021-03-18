var verified_phone_number = retrieveVerifiedPhoneNumber();
document.getElementById("verified-phone-number").setAttribute("value", verified_phone_number);

function retrieveVerifiedPhoneNumber() {
	//Currently returns placeholder value
	return "9420 6969";
}