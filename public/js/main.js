function changeBrowserColor(browser) {
	if(browser) {
		return $("."+browser.toLowerCase()).css("background-color");
	}
}

$(function() {
	
	$("#showQuickStats").on("click", function() {
		if(parseInt($("#quickStats").css("top")) != 0) {
			$("#quickStats").animate({"top": 0});
		}
		else {
			$("#quickStats").animate({"top": -85});
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
	var pages = $("#pages");
	var totalConnections = $("#totalConnections");
	var mostPopularBrowser = $("#mostPopularBrowser");
	var screenResContainer = $("#resolutions");
	var osContainer = $("#os");
	
	socket.on('connect', function() {
		$("#browsers").slideDown().addClass("activeControl");
	});
	
	socket.on('message', function(payload) {
		payload = BISON.decode(payload);
		
		totalConnections.html(payload.totalConnections);
		
		var trackingData = "";
		
		//Get the URL and number of connections for each tracker
		for(var i = 0; i < payload.trackers.length; i++) {
			trackingData += "<span class='tracker'><em>" + payload.trackers[i].url + "</em> - <strong>" + payload.trackers[i].numConnections + "</strong></span><br /><br />";
		}
		pages.html(trackingData);
		
		for(var browser in payload.browsers.count) {
			browserChart.browsers[browser] = payload.browsers.count[browser];
		}
		
        browserChart.repaint();
		
        mostPopularBrowser.css("color", changeBrowserColor(mostPopularBrowser.html()));
		
        var resolutionData = "";
        for(var resolution in payload.screenResolutions) {
			resolutionData += "<div>" + resolution + " - " + payload.screenResolutions[resolution] + "</div>";
    	}
        screenResContainer.html(resolutionData);
		
		var osData = "";
		for(var os in payload.os) {
			osData += "<div>" + os + " - " + payload.os[os] + "</div>";
		}
		osContainer.html(osData);
	});
	
});