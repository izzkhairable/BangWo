function getVolunteerTasks() {
	return null;
}

function getNoTaskImage() {
	return "https://www.foot.com/wp-content/uploads/2017/06/placeholder-square.jpg";
}

var volunteer_tasks = getVolunteerTasks();

if (volunteer_tasks == null) {
	document.getElementById("volunteer-task-header").innerHTML = "Currently no tasks available";
	document.getElementById("volunteer-task-list").innerHTML = "<p>We will notify you when there are new requests.</p>";
	document.getElementById("notaskimage").src = getNoTaskImage(); 
} else {
	document.getElementById("volunteer-task-header").innerHTML = "Volunteer Tasks Available";
	//Table with volunteer tasks
}