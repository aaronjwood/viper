$(function() {
	
	function changeBrowserColor(browser) {
		return $("."+browser.toLowerCase()+"").css("background-color");
	}
	
	var socket = io.connect();
	var tracking = document.getElementById("tracking");
	var totalConnections = document.getElementById("totalConnections");
	var mostPopularBrowser = document.getElementById("mostPopularBrowser");
	var screenResContainer = document.getElementById("screenResContainer");
	var osContainer = document.getElementById("osContainer");
	socket.on('connect', function() {
		tracking.innerHTML = "<span class='waiting'>Gathering statistics and processing data...</span>";
	});
	socket.on('message', function(payload) {
		totalConnections.innerHTML = payload.totalConnections;
		var trackingData = "";
		//For each of the tracker objects in the array, get the data we want out of it and push it into the trackingData variable
		for(var i = 0; i < payload.trackers.length; i++) {
			var tracker = payload.trackers[i];
			if(tracker.numConnections == 0) {
				continue;
			}
			trackingData += "<span class='tracker'><span class='num'>" + (i+1) + ".</span> <em>" + tracker.url + "</em> - <strong>" + tracker.numConnections + "</strong></span><br /><br />";
		}
		tracking.innerHTML = trackingData;
		for(var browser in payload.browsers.count) {
			browserChart.browsers[browser] = payload.browsers.count[browser];
		}
        browserChart.repaint();
        mostPopularBrowser.style.color = changeBrowserColor(mostPopularBrowser.innerHTML);
        console.log(mostPopularBrowser.innerHTML);
        var resolutionData = "";
        for(var resolution in payload.screenResolutions) {
			resolutionData += "<div>" + resolution + " - " + payload.screenResolutions[resolution] + "</div>";
    	}
        screenResContainer.innerHTML = resolutionData;
		var osData = "";
		for(var os in payload.os) {
			osData += "<div>" + os + " - " + payload.os[os] + "</div>";
		}
		osContainer.innerHTML = osData;
	});
	
});