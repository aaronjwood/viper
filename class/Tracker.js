var Tracker = function(client, url) {
	this.clients = {};
	this.url = url;
	this.clients[client.id] = client;
};

Tracker.sortByConnections = function(tracker1, tracker2) {
	return tracker2.numConnections - tracker1.numConnections;
};

Tracker.sendPayload = function(allTrackers, payload, config, socket) {
	var sortedTrackers = [];
	for(var tracker in allTrackers) {
		sortedTrackers.push(allTrackers[tracker]);
	}
	payload.trackers = sortedTrackers.sort(Tracker.sortByConnections);
	payload.trackers = sortedTrackers.slice(0, config.totalTrackers);
	socket.sockets.json.send(payload);
};

module.exports = Tracker;