var sticker_list = retrieveStickerList();
var task_list = retrieveTaskList();
var user_details = retrieveUserDetails(sticker_list.length, task_list.length);
document.title = user_details.name + "'s Profile | BangWo";
document.getElementById("name").innerHTML = user_details.name;
document.getElementById("tasks-completed").innerHTML = "Tasks completed: " + user_details.tasksCompleted;
document.getElementById("stickers-earned").innerHTML = "Stickers earned: " + user_details.stickersEarned;
displayUserStickersEarned(sticker_list);
displayUserTasksCompleted(task_list);

function retrieveUserDetails(sticker_count, task_count) {
	//Currently returns placeholder values
	return {
		name: "User",
	tasksCompleted: task_count,
	stickersEarned: sticker_count
	};
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