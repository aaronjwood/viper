var Tracker = function(client, url) {
	this.clients = {};
	this.url = url;
	this.clients[client.id] = client;
};

Tracker.sortByConnections = function(tracker1, tracker2) {
	return tracker2.numConnections - tracker1.numConnections;
};

Tracker.sendPayload = function(allTrackers, payload, config, socket) {
	socket.sockets.json.send(payload);
};

module.exports = Tracker;