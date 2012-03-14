//User object to hold each user's id and browser type
exports.user = function(id, browser) {
    this.id = id;
    this.browser = browser;
}


//TODO Add functionality to hold the browser's version and the platform it is running on
//Main tracker object
exports.track = function(sessId, url, connections) {
    //TODO rename sessId to clients
	this.sessId = [];
	this.sessId.push(sessId);
	this.url = url;
	this.connections = connections;
}

//This will sort the array of trackers in descending order
exports.sort = function(pageTracker1, pageTracker2) {
	return pageTracker2.connections - pageTracker1.connections;
}