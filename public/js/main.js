$(function() {
    
    var chart = {
    	chrome: 0,
		ie: 0,
		opera: 0,
		firefox: 0,
		safari: 0,
		android: 0,
		ipad: 0,
		iphone: 0,
		other: 0,
		total: function() {
			var total = 0;
			for(browser in this) {
				if(typeof this[browser] === "function") {
					continue;
				}
				total += this[browser];
			}
			return total;
		},
		height: function(browser) {
			var height = parseInt($(".chart").css("height"));
			var barHeight = this[browser] / this.total();
			barHeight = parseFloat(height * barHeight);
			barHeight = 200 - barHeight;
			return -barHeight;
		},
		updateChartCounts: function() {
			var chrome = $(".chrome .chartCount");
			var ie = $(".ie .chartCount");
			var opera = $(".opera .chartCount");
			var firefox = $(".firefox .chartCount");
			var safari = $(".safari .chartCount");
			var android = $(".android .chartCount");
			var ipad = $(".ipad .chartCount");
			var iphone = $(".iphone .chartCount");
			var other = $(".other .chartCount");
			chrome.text(this.chrome);
			ie.text(this.ie);
			opera.text(this.opera);
			firefox.text(this.firefox);
			safari.text(this.safari);
			android.text(this.android);
			ipad.text(this.ipad);
			iphone.text(this.iphone);
			other.text(this.other);
		},
		repaint: function() {
			var browserTotal = $("#browserTotal");
			var chrome = $(".chrome");
			var ie = $(".ie");
			var opera = $(".opera");
			var firefox = $(".firefox");
			var safari = $(".safari");
			var android = $(".android");
			var ipad = $(".ipad");
			var iphone = $(".iphone");
			var other = $(".other");
			browserTotal.text(this.total());
			chrome.stop().animate({"bottom": this.height("chrome")});
			ie.stop().animate({"bottom": this.height("ie")});
			opera.stop().animate({"bottom": this.height("opera")});
			firefox.stop().animate({"bottom": this.height("firefox")});
			safari.stop().animate({"bottom": this.height("safari")});
			android.stop().animate({"bottom": this.height("android")});
			ipad.stop().animate({"bottom": this.height("ipad")});
			iphone.stop().animate({"bottom": this.height("iphone")});
			other.stop().animate({"bottom": this.height("other")});
			this.updateChartCounts();
		}
	};
    
	var socket = io.connect();
	socket.on('connect', function() {
		$("#tracking").html("<span class='waiting'>Gathering statistics and processing data...</span>");
	});
	socket.on('message', function(payload) {
		document.getElementById("totalConnections").innerHTML = payload.totalConnections;
		var trackingData = "";
		//For each of the tracker objects in the array, get the data we want out of it and push it into the trackingData variable
		for(var i = 0; i < payload.trackers.length; i++) {
			trackingData += "<span class='tracker'><span class='num'>" + (i+1) + ".</span> <em>" + payload.trackers[i].url + "</em> - <strong>" + payload.trackers[i].numConnections + "</strong></span><br /><br />";
		}
		document.getElementById('tracking').innerHTML = trackingData;
        //If the data received is an object and has the count property, it is the browser counter
            chart.chrome = payload.browsers.count.Chrome;
            chart.ie = payload.browsers.count.IE;
            chart.opera = payload.browsers.count.Opera;
            chart.firefox = payload.browsers.count.Firefox;
            chart.safari = payload.browsers.count.Safari;
            chart.android = payload.browsers.count.Android;
            chart.ipad = payload.browsers.count.iPad;
            chart.iphone = payload.browsers.count.iPhone;
            chart.other = payload.browsers.count.Other;
            chart.repaint();
            var resolutionData = "";
            for(var resolution in payload.screenResolutions) {
				resolutionData += "<div>" + resolution + " - " + payload.screenResolutions[resolution] + "</div>";
        	}
			$("#screenResContainer").html(resolutionData);
	});
	
});