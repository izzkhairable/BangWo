function getTaskCategory() {
	//Check page number when getting task category
	return null;
}

function getPageNum() {
	//Track current page & total pages available
	return "#/#";
}

var task_category = getTaskCategory();

if (volunteer_tasks == null) {
	document.getElementById("task-category").innerHTML = "Oops problem getting task categories";
} else {
	document.getElementById("task-category").innerHTML = "Task Categories Available";
	//Tiles with task categories
	var page_num = 'Page' + getPageNum();
	document.getElementById("page-num").innerHTML = page_num;
}