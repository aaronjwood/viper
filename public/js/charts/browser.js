var browserChart = {
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
		if(this.total() == 0) {
			return -height;
		}
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