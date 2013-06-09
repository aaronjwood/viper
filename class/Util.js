var Util = function() {};

//Return the browser's name
Util.getBrowserInfo = function(userAgent) {
	
	if(typeof userAgent === "undefined" || !userAgent) {
		return {
			platform: "Other",
			isCellular: false,
			browser: "Other",
			os: "Other"
		};
	}
	
	var platform;
	var cellular = false;
	var browser;
	var os;
	
	//Detect cellular capabilities
	if(userAgent.match(/iPhone|Android|BlackBerry|Windows Phone/gi)) {
		cellular = true;
	}
	
	//Detect platform
	var platformTest = userAgent.match(/iPhone|iPad|Android|BlackBerry|RIM Tablet|Windows Phone/gi);
	if(platformTest == "iPhone" || platformTest == "iPad") {
		platform = "Apple";
		os = "Mac OS X";
	}
	else if(platformTest == "Android") {
		platform = "Google";
	}
	else if(platformTest == "Blackberry" || platformTest == "RIM Tablet") {
		platform = "RIM";
	}
	else if(platformTest == "Windows Phone") {
		platform = "Microsoft";
	}
	else {
		platform = "Other";
	}
	
	//Detect browser
	var browserTest = userAgent.match(/CriOS|Chrome|Firefox|MSIE|iPad|iPhone|Android|Opera|Safari/gi);
	if(browserTest.indexOf("CriOS") != -1 && (browserTest.indexOf("iPad") != -1 || browserTest.indexOf("iPhone") != -1)) {
		browser = "Chrome";
		platform = "Apple";
		os = "iOS";
	}
	else if(browserTest.indexOf("Chrome") != -1) {
		browser = "Chrome";
	}
	else if(browserTest == "Firefox") {
		browser = "Firefox";
	}
	else if(browserTest == "Opera") {
		browser = "Opera";
	}
	else if(browserTest.indexOf("Safari") != -1 && browserTest.indexOf("Chrome") == -1) {
		browser = "Safari";
	}
	else if(browserTest == "MSIE") {
		browser = "IE";
		platform = "Microsoft";
	}
	else if(browserTest == "Android") {
		browser = "Android";
		platform = "Google";
	}
	else if(browserTest == "iPad") {
		browser = "iPad";
		platform = "Apple";
		os = "iOS";
	}
	else if(browserTest == "iPhone") {
		browser = "iPhone";
		platform = "Apple";
		os = "iOS";
	}
	else {
		browser = "Other";
	}
	
	//Detect operating system
	var osTest = userAgent.match(/Windows NT 5.0|Windows NT 5.1|Windows NT 6.0|Windows NT 6.1|Windows NT 6.2|Mac|UNIX|Linux/gi);
	if(osTest == "Windows NT 5.0") {
		os = "Windows 2000";
		platform = "Microsoft";
	}
	else if(osTest == "Windows NT 5.1") {
		os = "Windows XP";
		platform = "Microsoft";
	}
	else if(osTest == "Windows NT 6.0") {
		os = "Windows Vista";
		platform = "Microsoft";
	}
	else if(osTest == "Windows NT 6.1") {
		os = "Windows 7";
		platform = "Microsoft";
	}
	else if(osTest == "Windows NT 6.2") {
		os = "Windows 8";
		platform = "Microsoft";
	}
	else if(osTest == "Mac") {
		os = "Mac OS X";
		platform = "Apple";
	}
	else if(browser == "iPad" || browser == "iPhone") {
		os = "iOS";
		platform = "Apple";
	}
	else if(browser == "Android") {
		os = "Android";
		platform = "Google";
	}
	else if(osTest == "UNIX") {
		os = "Unix";
	}
	else if(osTest == "Linux") {
		os = "Linux";
	}
	else {
		os = "Other";
	}
	
	return {
		platform: platform,
		isCellular: cellular,
		browser: browser,
		os: os
	};
};

module.exports = Util;