var Tracker = function(sessionId, url, numConnections) {
    this.clients = [];
    this.url = url;
    this.numConnections = numConnections;
    this.clients.push(sessionId);
}

Tracker.sortByConnections = function(tracker1, tracker2) {
    return tracker2.numConnections - tracker1.numConnections;
}

module.exports = Tracker;