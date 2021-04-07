//var user = getUserSession();
var user_id = "UEus7Fjf00Q9C4vFUwBtcnVznjp2";
displayUserDetails(user_id);

/*
document.title = user_details.name + "'s Profile | BangWo";
document.getElementById("name").innerHTML = user_details.name;
document.getElementById("tasks-completed").innerHTML = "Tasks completed: " + user_details.tasksCompleted;
document.getElementById("stickers-earned").innerHTML = "Stickers earned: " + user_details.stickersEarned;
displayUserStickersEarned(sticker_list);
displayUserTasksCompleted(task_list);
*/

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

function displayUserDetails(user_id) {
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
	let tasks_completed = 0;
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
	} else {
		;document.getElementById("sticker-list").innerHTML = "<p>No stickers collected yet</p>";
	}
	
	document.title = name + "'s Profile";
	document.getElementById("name").innerHTML = name;
	document.getElementById("tasks-completed").innerHTML = "Tasks completed: " + tasks_completed;
	document.getElementById("stickers-earned").innerHTML = "Stickers earned: " + stickers_earned;
	
}

function retrieveStickerList() {
	var sticker_list = [];
	
	return sticker_list;
}

function retrieveTaskList() {
	var task_list = [];
	
	return task_list;
}

function displayUserStickersEarned(sticker_list) {
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