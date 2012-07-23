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
			chrome.animate({"bottom": this.height("chrome")});
			ie.animate({"bottom": this.height("ie")});
			opera.animate({"bottom": this.height("opera")});
			firefox.animate({"bottom": this.height("firefox")});
			safari.animate({"bottom": this.height("safari")});
			android.animate({"bottom": this.height("android")});
			ipad.animate({"bottom": this.height("ipad")});
			iphone.animate({"bottom": this.height("iphone")});
			other.animate({"bottom": this.height("other")});
			this.updateChartCounts();
		}
	};
    
	var socket = io.connect();
	socket.on('connect', function() {
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
				trackingData += "<span class='tracker'><span class='num'>" + (i+1) + ".</span> <em>" + msg[i].url + "</em> - <strong>" + msg[i].numConnections + "</strong></span><br /><br />";
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
            browserCounts += "Android: " + msg.count.Android + "<br />";
            browserCounts += "iPad: " + msg.count.iPad + "<br />";
            browserCounts += "iPhone: " + msg.count.iPhone + "<br />";
            browserCounts += "Other: " + msg.count.Other + "<br />";
            document.getElementById('browserCount').innerHTML = browserCounts;
            
            chart.chrome = msg.count.Chrome;
            chart.ie = msg.count.IE;
            chart.opera = msg.count.Opera;
            chart.firefox = msg.count.Firefox;
            chart.safari = msg.count.Safari;
            chart.android = msg.count.Android;
            chart.ipad = msg.count.iPad;
            chart.iphone = msg.count.iPhone;
            chart.other = msg.count.Other;
            chart.repaint();
        }
	});
	
});