var Util = function() {
    
}

//Return the browser's name
Util.getBrowser = function(browser) {
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
}

module.exports = Util;