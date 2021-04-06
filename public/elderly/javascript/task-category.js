function getTaskCategory() {
	//Check page number when getting task category
	//If got category then return as array [(photo url, name),(photo, name),(photo, name)]
	var result = [["../assets/images/shopping-rafiki.svg","Carrying Items"],["../assets/images/electrician-rafiki.svg","Changing Light Bulbs"],["../assets/images/gardening-rafiki.svg","Gardening Stuff"],["../assets/images/ocd-rafiki.svg","Spring Cleaning"],["../assets/images/working-rafiki.svg","IT Devices Help"],["../assets/images/lost-rafiki.svg","Go Somewhere"],["../assets/images/empty-rafiki.svg","Moving Furniture"],["../assets/images/cooking-rafiki.svg","Cooking Food"]]
	return result;
}

document.getElementById("header-text").innerHTML = "You need help doing what?";

var task_category = getTaskCategory();

if (task_category == null) {
	//No categories to show
	document.getElementById("task-category").innerHTML = "Nothing";
} else {
	var first_page = true;
	var cat_count = 0;
	var page_count = 0;
	var color_count = 1;
	for (let category of task_category) {
		if (page === undefined){
			var page = document.createElement("div");
			page.setAttribute("id", "category-page");
			page.className = "carousel-item col card-deck";
		}
		if (page_row === undefined) {
			var page_row = document.createElement("div");
			page_row.setAttribute("id", "page-row");
			page_row.className = "row";
		}

		var tile = document.createElement("div");
		tile.className = "card col m-2 text-white border-dark";
		if (color_count === 1) {
			tile.classList.add("bg-creme");
			color_count++;
		} else if (color_count === 2) {
			tile.classList.add("bg-green");
			color_count++;
		} else if (color_count === 3) {
			tile.classList.add("bg-pink");
			color_count++;
		} else {
			tile.classList.add("bg-purple");
			color_count = 1;
		}

		var tile_image = document.createElement("img");
		tile_image.src = category[0];
		tile_image.className = "category-image d-block card-img-top";
		tile.appendChild(tile_image);

		var tile_words = document.createElement("div");
		tile_words.className = "category-name card-title";
		var tile_name = document.createElement("h6")
		tile_name.className = "card-text";
		tile_name.innerHTML = category[1];
		tile_words.appendChild(tile_name);
		tile.appendChild(tile_words);

		var link = document.createElement("a");
		link.className = "stretched-link";
		link.href = "get-location.html?taskname=" + category[1];
		tile.appendChild(link);

		page_row.appendChild(tile);
		tile = undefined;
		
		cat_count++;
		if (cat_count%2 === 0 || category == task_category[task_category.length-1]) {
			page.appendChild(page_row);
			page_row = undefined;
		}
		if (cat_count%4 === 0 || category == task_category[task_category.length-1]) {
			if (first_page) {
				page.classList.add("active");
				first_page = false;
			}
			var element = document.getElementById("task-category");
			element.appendChild(page);
			page = undefined;
		}
	}
	// var page_count = (Math.floor(cat_count/4));
	var totalItems = (Math.floor(cat_count/4));
	var currentIndex = $('div.active').index() + 1;
	$('.page-indicator').html('Page ' + currentIndex + ' / ' + totalItems + '');
}

$('#cat-carousel').on('slid.bs.carousel', function() {
	currentIndex = $('div.active').index() + 1;
	$('.page-indicator').html('Page ' + currentIndex + ' / ' + totalItems + '');
});