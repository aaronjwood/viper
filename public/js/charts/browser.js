var browserChart = {
	browsers: {},
	total: function() {
		var total = 0;
		for(browser in this.browsers) {
			total += this.browsers[browser];
		}
		return total;
	},
	mostPopular: function() {
		var highestCount = 0;
		var mostPopular = "";
		for(var browser in this.browsers) {
			if(this.browsers[browser] > highestCount) {
				mostPopular = browser;
				highestCount = this.browsers[browser];
			}
		}
		return mostPopular;
	},
	height: function(browser) {
		var height = parseInt($(".chart").css("height"));
		if(this.total() == 0) {
			return -height;
		}
		var barHeight = this.browsers[browser] / this.total();
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
		chrome.text(this.browsers.Chrome);
		ie.text(this.browsers.IE);
		opera.text(this.browsers.Opera);
		firefox.text(this.browsers.Firefox);
		safari.text(this.browsers.Safari);
		android.text(this.browsers.Android);
		ipad.text(this.browsers.iPad);
		iphone.text(this.browsers.iPhone);
		other.text(this.browsers.Other);
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
		var mostPopularBrowser = $("#mostPopularBrowser");
		browserTotal.text(this.total());
		chrome.stop().animate({"bottom": this.height("Chrome")});
		ie.stop().animate({"bottom": this.height("IE")});
		opera.stop().animate({"bottom": this.height("Opera")});
		firefox.stop().animate({"bottom": this.height("Firefox")});
		safari.stop().animate({"bottom": this.height("Safari")});
		android.stop().animate({"bottom": this.height("Android")});
		ipad.stop().animate({"bottom": this.height("iPad")});
		iphone.stop().animate({"bottom": this.height("iPhone")});
		other.stop().animate({"bottom": this.height("Other")});
		mostPopularBrowser.text(this.mostPopular());
		this.updateChartCounts();
	}
};