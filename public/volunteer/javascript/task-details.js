getTaskDetails(getTaskId());
window.onload = getAllAdvice(getTaskId());

function getTaskId() {
	//Currently returns placeholder value for testing task
	return "1616556880702-zmETkZXqo2SwqwyGXD4sG9hHUSh2";
}

function getTaskDetails(task_id) {
	const data = {
		"data": {
			"taskId": task_id
		}
	};
	
	fetch('https://us-central1-bangwo-d7640.cloudfunctions.net/tasks-getTaskDetails', {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then( response => response.json())
	.then(data => {
		console.log('Success:', data);
		//console.log(JSON.stringify(data));
		displayTaskDetails(data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function displayTaskDetails(task_details) {
	//document.getElementById("name").innerHTML = task_details.name;
	//document.getElementById("age").innerHTML = task_details.age;
	document.getElementById("task_name").innerHTML = task_details.result.taskName;
	document.getElementById("task_description").innerHTML = task_details.result.taskDescription;
	document.getElementById("address").innerHTML = task_details.result.address + ", " + task_details.result.unitNo;
}

function formatAdvice(advice_object) {
	//console.log(JSON.stringify(advice_object));
	advice_array = advice_object.result;
	//console.log(JSON.stringify(advice_array));
	if (JSON.stringify(advice_array) == "[]") {
		//Display message to show no volunteer advice exists
		//console.log("In here");
		//document.getElementById("card-header").innerHTML = "No advice given for this user yet.";
	} else {
		//Display the existing volunteer advice
		var advice_string = "";
		for (const advice_set of advice_array) {
			advice_string += advice_set.title + ":\n" + advice_set.description + "\n\n";
		}
		window.alert(advice_string);
	}
}

function displayAdvice(elderly_id) {
		const data = {
		"data": {
			"elderlyId": elderly_id
		}
	};
	
	fetch('https://us-central1-bangwo-d7640.cloudfunctions.net/advice-getAdviceByElderly', {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then( response => response.json())
	.then(data => {
		console.log('Success:', data);
		//console.log(JSON.stringify(data));
		formatAdvice(data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
	
	/*
	var advice_array = [];
	
	//Currently returns place holder advice from volunteers
	advice_array.push(["10 December 2019", "Aunty loves to give snacks!"]);
	advice_array.push(["1 January 2020", "Don't bring up the children. It makes aunty sad."]);
	advice_array.push(["2 February 2020", "Watch out for the bed bugs..."]);
	
	return advice_array;
	*/
	
}

function getAllAdvice(task_id) {
	const data = {
		"data": {
			"taskId": task_id
		}
	};
	
	fetch('https://us-central1-bangwo-d7640.cloudfunctions.net/tasks-getTaskDetails', {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then( response => response.json())
	.then(data => {
		console.log('Success:', data);
		//console.log(JSON.stringify(data));
		displayAdvice(data.result.elderlyId);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function userArrived() {
	//Updates elderly that volunteer has arrived
	
	//Uses location.replace to redirect, preventing users from clicking "Back" button
	window.location.replace("task-arrived.html");
}

function taskComplete() {
	//Update db that task has been completed
	
	//Redirect using location.replace so user cannot click back button
	window.location.replace("task-complete.html");
}