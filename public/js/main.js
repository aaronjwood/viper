function changeBrowserColor(browser) {
	if(browser) {
		return $("."+browser.toLowerCase()).css("background-color");
	}
}

$(function() {
	
	$("#showQuickStats").on("click", function(e) {
		if(parseInt($("#quickStats").css("top")) != 0) {
			$("#quickStats").animate({"top": 0});
		}
		else {
			$("#quickStats").animate({"top": -84});
		}
		return false;
	});
	
	$(".control a").on("click", function() {
		var control = $(this).attr("class");
		$(".activeControl").slideUp(400, function() {
			$("#"+control).slideDown(400).addClass("activeControl");
		}).removeClass("activeControl");
		return false;
	});
	
	browserChart.init();
	
	var socket = io.connect();
	var pages = document.getElementById("pages");
	var totalConnections = document.getElementById("totalConnections");
	var mostPopularBrowser = document.getElementById("mostPopularBrowser");
	var screenResContainer = document.getElementById("resolutions");
	var osContainer = document.getElementById("os");
	
	socket.on('connect', function() {
		//TODO activate first panel
		//TODO think about how to show/hide the various panels
	});
	socket.on('message', function(payload) {
		totalConnections.innerHTML = payload.totalConnections;
		var trackingData = "";
		//For each of the tracker objects, get the data we want out of it
		for(var i = 0; i < payload.trackers.length; i++) {
			var tracker = payload.trackers[i];
			if(tracker.numConnections == 0) {
				continue;
			}
			trackingData += "<span class='tracker'><span class='num'>" + (i+1) + ".</span> <em>" + tracker.url + "</em> - <strong>" + tracker.numConnections + "</strong></span><br /><br />";
		}
		pages.innerHTML = trackingData;
		for(var browser in payload.browsers.count) {
			browserChart.browsers[browser] = payload.browsers.count[browser];
		}
        browserChart.repaint();
        mostPopularBrowser.style.color = changeBrowserColor(mostPopularBrowser.innerHTML);
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