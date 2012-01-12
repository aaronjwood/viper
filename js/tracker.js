var method = require('../sys/functions.js');

//Tracker object
//TODO Add functionality to hold the browser's version and the platform it is running on
exports.track = function(sessId, url, browser, connections) {
	this.sessId = [];
	this.sessId.push(sessId);
	this.url = url;
	this.browser = method.getBrowser(browser);
	this.connections = connections;
}

//This will sort the array of trackers in descending order
exports.sort = function(pageTracker1, pageTracker2) {
	return pageTracker2.connections - pageTracker1.connections;
}