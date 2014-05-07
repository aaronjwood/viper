/**
 * Tracker class constructor
 * @param {User} client
 * @param {String} url
 * @returns {Tracker}
 */
var Tracker = function(client, url) {
    this.clients = {};
    this.url = url;
    this.clients[client.userId] = client;
};

/**
 * Sort trackers by connections descending
 * @param {Tracker} tracker1
 * @param {Tracker} tracker2
 * @returns {int}
 */
Tracker.sortByConnections = function(tracker1, tracker2) {
    return tracker2.numConnections - tracker1.numConnections;
};

/**
 * Sorts the trackers and sends the configured number of trackers back over the socket
 * @param {Object} allTrackers
 * @param {Object} payload
 * @param {Object} config
 * @param {Object} socket
 */
Tracker.sendPayload = function(allTrackers, payload, config, socket) {
    var sortedTrackers = [];
    for (var tracker in allTrackers) {
        sortedTrackers.push(allTrackers[tracker]);
    }

    //Sort the trackers and send the top n as set in the configuration file
    payload.trackers = sortedTrackers.sort(Tracker.sortByConnections).slice(0, config.totalTrackers);
    socket.sockets.json.send(payload);
};

module.exports = Tracker;