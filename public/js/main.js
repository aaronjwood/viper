//Return a random color from an array of specified colors
function colorPicker() {
	var colors = ["#ebb12b", "#ff9191", "#ffffff", "#75ff75", "#ffff00", "#b2b2b2"];
	return colors[Math.floor(Math.random()*6)];
}

$(function() {
	var socket = io.connect();
	socket.on('connect', function() {
		console.log('Connected');
		$("#tracking").html("<span class='waiting'>Gathering statistics and processing data...</span>");
	});
	socket.on('message', function(msg) {
		//If the data received was an integer, it's the total connection count
		if(parseInt(msg) || msg == 0) {
			$("#totalConnections").html(msg);
		}
		//If the data received is an array, it is the array of trackers
		else if(msg instanceof Array) {
			var trackingData = "";
			//For each of the tracker objects in the array, get the data we want out of it and push it into the trackingData variable
			for(var i = 0; i < msg.length; i++) {
				trackingData += "<span class='tracker'><span class='num'>" + (i+1) + ".</span> <em>" + msg[i].url + "</em> - <strong style='color: " + colorPicker() + "'>" + msg[i].connections + "</strong></span><br /><br />";
			}
			//Update page (innerHTML seems to be the fastest)
			document.getElementById('tracking').innerHTML = trackingData;
		}
        //If the data received is an object and has the count property, it is the browser counter
        else if(msg instanceof Object && msg.count !== "undefined") {
            var browserCounts = "Google Chrome: " + msg.count.Chrome + " <br />";
            browserCounts += "Mozilla Firefox: " + msg.count.Firefox + " <br />";
            browserCounts += "Apple Safari: " + msg.count.Safari + " <br />";
            browserCounts += "Opera: " + msg.count.Opera + " <br />";
            browserCounts += "Microsoft Internet Explorer: " + msg.count.IE + " <br />";
            document.getElementById('browserCount').innerHTML = browserCounts;
        }
	});
});