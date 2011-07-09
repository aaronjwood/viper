//Return a random color from an array of specified colors
function colorPicker() {
	var colors = ["#ebb12b", "#ff9191", "#ffffff", "#75ff75", "#ffff00", "#b2b2b2"];
	return colors[Math.floor(Math.random()*6)];
}



$(function() {
	var socket = io.connect();
	socket.on('connect', function() {
		console.log('Connected');
		//TODO Make it so when a user connects, it immediately fetches the current data from the server. Right now, I am relying on data coming in to populate the page.
		$("#tracking").html("<span class='waiting'>Gathering statistics and processing data...</span>");
	});
	socket.on('message', function(msg) {
		//If the data received was an integer, it's the total connection count
		if(parseInt(msg) || msg == 0) {
			$("#totalConnections").html(msg);
		}
		//The data received should be an array of objects
		//TODO implement additional checking to make sure the data is an array of objects. There's not enough checking right now...
		else {
			var trackers = msg;
			var trackingData = "";
			//For each of the tracker objects in the array, get the data we want out of it and push it into the trackingData variable
			for(i = 0; i < trackers.length; i++) {
				//TODO wrap everything inside of a div (increases DOM insertion speed!)
				trackingData += "<span class='tracker'><span class='num'>" + (i+1) + ".</span> <em>" + trackers[i].url + "</em> - <strong style='color: " + colorPicker() + "'>" + trackers[i].connections + "</strong></span><br /><br />";
			}
			//Update page
			$("#tracking").html(trackingData);
		}
	});
});