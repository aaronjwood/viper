var Util = function() {};

//Return the browser's name
Util.getBrowserInfo = function(userAgent) {
	
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
	var browserTest = userAgent.match(/CriOS|Chrome|Firefox|iPad|iPhone|Android/gi);
	if(browserTest.indexOf("CriOS") != -1 && (browserTest.indexOf("iPad") != -1 || browserTest.indexOf("iPhone") != -1)) {
		platform = "Apple";
		browser = "Chrome";
	}
	else if(browserTest == "Chrome") {
		browser = "Chrome";
	}
	else if(browserTest == "Firefox") {
		browser = "Firefox";
	}
	else if(browserTest == "Android") {
		browser = "Android";
	}
	else if(browserTest == "iPad") {
		browser = "iPad";
	}
	else if(browserTest == "iPhone") {
		browser = "iPhone";
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