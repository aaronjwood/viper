var browserChart = {
	browsers: {},
	browserTotal: null,
	mostPopularBrowser: null,
	chromeCount: null,
	ieCount: null,
	operaCount: null,
	firefoxCount: null,
	safariCount: null,
	androidCount: null,
	ipadCount: null,
	iphoneCount: null,
	otherCount: null,
	chrome: null,
	ie: null,
	opera: null,
	firefox: null,
	safari: null,
	android: null,
	ipad: null,
	iphone: null,
	other: null,
	init: function() {
		this.browserTotal = $("#browserTotal");
		this.mostPopularBrowser = $("#mostPopularBrowser");
		this.chromeCount = $(".chrome .chartCount");
		this.ieCount = $(".ie .chartCount");
		this.operaCount = $(".opera .chartCount");
		this.firefoxCount = $(".firefox .chartCount");
		this.safariCount = $(".safari .chartCount");
		this.androidCount = $(".android .chartCount");
		this.ipadCount = $(".ipad .chartCount");
		this.iphoneCount = $(".iphone .chartCount");
		this.otherCount = $(".other .chartCount");
		this.chrome = $(".chrome");
		this.ie = $(".ie");
		this.opera = $(".opera");
		this.firefox = $(".firefox");
		this.safari = $(".safari");
		this.android = $(".android");
		this.ipad = $(".ipad");
		this.iphone = $(".iphone");
		this.other = $(".other");
	},
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
		this.chromeCount.text(this.browsers.Chrome);
		this.ieCount.text(this.browsers.IE);
		this.operaCount.text(this.browsers.Opera);
		this.firefoxCount.text(this.browsers.Firefox);
		this.safariCount.text(this.browsers.Safari);
		this.androidCount.text(this.browsers.Android);
		this.ipadCount.text(this.browsers.iPad);
		this.iphoneCount.text(this.browsers.iPhone);
		this.otherCount.text(this.browsers.Other);
	},
	repaint: function() {
		this.browserTotal.text(this.total());
		this.chrome.stop().animate({"bottom": this.height("Chrome")});
		this.ie.stop().animate({"bottom": this.height("IE")});
		this.opera.stop().animate({"bottom": this.height("Opera")});
		this.firefox.stop().animate({"bottom": this.height("Firefox")});
		this.safari.stop().animate({"bottom": this.height("Safari")});
		this.android.stop().animate({"bottom": this.height("Android")});
		this.ipad.stop().animate({"bottom": this.height("iPad")});
		this.iphone.stop().animate({"bottom": this.height("iPhone")});
		this.other.stop().animate({"bottom": this.height("Other")});
		this.mostPopularBrowser.text(this.mostPopular());
		this.updateChartCounts();
	}
};