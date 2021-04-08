function submitAdvice() {
	var advice_input = document.getElementById("adviceInput").value;
	//console.log("Input is: " + advice_input);
	
	if (advice_input && advice_input != "") {
		//Submit and redirect to home
		
			const data = {
		"data": {
			"volunteerId": retrieveUserId(),
			elderlyId: "",
			title: "",
			'description': advice_input
		}
	};
	
	fetch('https://us-central1-bangwo-d7640.cloudfunctions.net/advice-sendAdvice', {
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
		
	})
	.catch((error) => {
		console.error('Error:', error);
	});
		
	window.	location.href = "main.html";
	}
	
}

function retrieveUserId() {
	/*
	
	*/
	
	return "UEus7Fjf00Q9C4vFUwBtcnVznjp2";
}
