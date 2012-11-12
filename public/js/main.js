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
		$("#browsers").slideDown(400).addClass("activeControl");
	});
	socket.on('message', function(payload) {
		totalConnections.innerHTML = payload.totalConnections;
		var trackingData = "";
		//Get the URL and number of connections for each tracker
		
		var i = 0; //Temporary counter until tracker sorting is implemented again
		for(var tracker in payload.trackers) {
			trackingData += "<span class='tracker'><em>" + tracker + "</em> - <strong>" + payload.trackers[tracker].numConnections + "</strong></span><br /><br />";
			//Temporary until tracker sorting is implemented again
			if(i == 10) {
				break;
			}
			i++;
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