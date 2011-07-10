//Tracker object
//TODO Add functionality to hold the browser's name, version, and the platform it is running on
exports.track = function(sessId, url, browser, connections) {
	this.sessId = [];
	this.sessId.push(sessId);
	this.url = url;
	this.connections = connections;
	this.browser = getBrowser(browser);
	
	//TODO this should not just return the browser being used for the specific object. This needs to be a separate tracking metric that gives totals, etc. This should probably NOT be inside of this object...migrate to the server
	function getBrowser(browser) {
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
}

//This will sort the array of trackers in descending order
exports.sort = function(pageTracker1, pageTracker2) {
	return pageTracker2.connections - pageTracker1.connections;
}