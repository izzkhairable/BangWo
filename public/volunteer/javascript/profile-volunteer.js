//var user = getUserSession();
var user_id = "UEus7Fjf00Q9C4vFUwBtcnVznjp2";
getUserDetails(user_id);
getUserTasksNo(user_id);

/*
function getUserSession() {
	document.addEventListener('DOMContentLoaded', function () {
		firebase.auth().onAuthStateChanged( function (user) {
			if (user) {
				return user;
			} else {
				//Redirect
			}
		}
	}
}
*/

function getUserDetails(user_id) {
	const data = {
		"data": {
			"volunteerId": user_id
		}
	};
	
	fetch('https://us-central1-bangwo-d7640.cloudfunctions.net/volunteerProfile-getVolunteerProfile', {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then( response => response.json())
	.then(data => {
		console.log('Success:', data);
		console.log(JSON.stringify(data.result));
		displayVolunteerProfile(data.result);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function displayVolunteerProfile(profile_info) {
	let name;
	let stickers_table = "";
	let stickers_earned = 0;
	let picture_url = "";
	
	if (profile_info.name) {
		name = profile_info.name;
	} else {
		name = "User";
	}
	if (profile_info.profilePicUrl) {
		picture_url = profile_info.profilePicUrl;
	} 
	if (profile_info.stickers) {
		//Displays all stickers, counts total
		stickers_table += "<table><tr>";
		for (const sticker_link in profile_info) {
			stickers_earned += 1;
			//console.log(stickers_earned);
			//console.log(stickers_table);
			if (stickers_earned != 1 && (stickers_earned - 1) % 3 == 0) {
				stickers_table += "</tr>";
				stickers_table += "<td><img href='" + sticker_link + "'></td>";
			} else {
				stickers_table += "<td><img href='" + sticker_link + "'></td>";
			}
		}
		stickers_table += "</table>";
		document.getElementById("sticker-list").innerHTML = stickers_table;
		console.log(stickers_table);
	} else {
		;document.getElementById("sticker-list").innerHTML = "<p>No stickers collected yet</p>";
	}
	
	document.title = name + "'s Profile";
	document.getElementById("name").innerHTML = name;
	document.getElementById("stickers-earned").innerHTML = "Stickers earned: " + stickers_earned;
	
}

function getUserTasksNo(user_id) {
	const data = {
		"data": {
			"volunteerId": user_id
		}
	};
	
	fetch('https://us-central1-bangwo-d7640.cloudfunctions.net/volunteerProfile-getNumCompletedTasksByVolunteer', {
		method: 'POST', // or 'PUT'
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	})
	.then( response => response.json())
	.then(data => {
		console.log('Success:', data);
		//console.log(JSON.stringify(data.result));
		document.getElementById("tasks-completed").innerHTML = "Tasks completed: " + JSON.stringify(data.result);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
}

function displayUserStickers(sticker_list) {
	if (sticker_list.length==0) {
		//Display that user has no stickers
		document.getElementById("sticker-list").innerHTML = "<p>No stickers collected yet</p>";
	} else {
		//Display all stickers
		
	}
}

function displayUserTasksCompleted(task_list) {
	if (task_list.length==0) {
		//Display that user has not completed any tasks
		document.getElementById("task-list").innerHTML = "<p>No tasks completed yet</p>";
	} else {
		//Display all tasks completed
		
	}
}