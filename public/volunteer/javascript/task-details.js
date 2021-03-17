var task_details = getTaskDetails();
document.getElementById("name").innerHTML = task_details.name;
document.getElementById("age").innerHTML = task_details.age;
document.getElementById("task_name").innerHTML = task_details.taskName;
document.getElementById("task_description").innerHTML = task_details.taskDescription;
document.getElementById("address").innerHTML = task_details.address;

function getTaskDetails() {
	var task_details = {
		name: "MC Hammer",
		age: 60,
		taskName: "Hammer Time",
		taskDescription: "Move your body move your body",
		address: "123 Sesame Street",
		postalCode: 420690
	}
	return task_details;
}

function displayVolunteerAdvice() {
	var advice_array = retrieveVolunteerAdvice();
	console.log("in function");
	if (advice_array.length == 0) {
		//Display message to show no volunteer advice exists
		window.alert("No history of advice from previous volunteers for this user");
	} else {
		//Display the existing volunteer advice
		var advice_string = "";
		for (const advice_set of advice_array) {
			advice_string += advice_set[0] + ":\n" + advice_set[1] + "\n\n";
		}
		window.alert(advice_string);
	}
}

function retrieveVolunteerAdvice() {
	var advice_array = [];
	
	//Currently returns place holder advice from volunteers
	advice_array.push(["10 December 2019", "Aunty loves to give snacks!"]);
	advice_array.push(["1 January 2020", "Don't bring up the children. It makes aunty sad."]);
	advice_array.push(["2 February 2020", "Watch out for the bed bugs..."]);
	
	return advice_array;
}