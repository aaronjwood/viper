var Util = function() {};

//Return the browser's name
Util.getBrowser = function(browser) {
	if(typeof browser === "undefined") {
		return "Other";
	}
	
	var agent = browser.match(/Chrome|Firefox|MSIE|iPad|iPhone|Android|Opera|Safari/i);
	
	if(agent == "Chrome") {
		return "Chrome";
	}
	else if(agent == "Firefox") {
		return "Firefox";
	}
	else if(agent == "Opera") {
		return "Opera";
	}
	else if(agent == "MSIE") {
		return "IE";
	}
	else if(agent == "Safari") {
		return "Safari";
	}
	else if(agent == "Android") {
		return "Android";
	}
	else if(agent == "iPad") {
		return "iPad";
	}
	else if(agent == "iPhone") {
		return "iPhone";
	}
	else {
		return "Other";
	}
};

Util.getOs = function(operatingSystem) {
	var os = operatingSystem.match(/Win|Mac|UNIX|Linux/gi);
	if(os == "Win") {
		return "Windows";
	}
	else if(os == "Mac") {
		return "Mac";
	}
	else if(os == "UNIX") {
		return "Unix";
	}
	else if(os == "Linux") {
		return "Linux";
	}
	else {
		return "Other";
	}
};

module.exports = Util;