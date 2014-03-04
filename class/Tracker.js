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
 * Determines if there are any connections to the dashboard.
 * If there are, the trackers are sorted and sliced based on the configuration, and sent back over the socket
 * @param {Object} allTrackers
 * @param {Object} payload
 * @param {Object} config
 * @param {Object} socket
 */
Tracker.sendPayload = function(allTrackers, payload, config, socket) {

    //Only send the payload if there is a connection to the dashboard
    if (Object.keys(socket.sockets.manager.connected).length > 0) {
        var sortedTrackers = [];
        for (var tracker in allTrackers) {
            sortedTrackers.push(allTrackers[tracker]);
        }

        //Sort the trackers and send the top n as set in the configuration file
        payload.trackers = sortedTrackers.sort(Tracker.sortByConnections).slice(0, config.totalTrackers);
        socket.sockets.json.send(payload);
    }
};

module.exports = Tracker;