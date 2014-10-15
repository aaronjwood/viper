/**
 * Tracker class constructor
 * @param Client client Data from the client containing tracking information
 * @param String url URL that all clients are associated with
 * @returns Tracker New instance of the Tracker class
 */
var Tracker = function(client, url) {
    this.clients = {};
    this.url = url;
    this.clients[client.id] = client;
    this.numConnections = 1;
};

/**
 * Sort trackers by connections descending
 * @param Tracker tracker1 First tracker used in comparison
 * @param Tracker tracker2 Second tracker used in comparison
 * @returns int Sorting order
 */
Tracker.sortByConnections = function(tracker1, tracker2) {
    return tracker2.numConnections - tracker1.numConnections;
};

/**
 * Sorts the trackers and sends the configured number of trackers back over the socket
 * @param Object allTrackers Object containing all active trackers
 * @param Object payload Main payload that the client/server uses and transfers
 * @param Object config Configuration settings object
 * @param Object socket Socket object used to push data back
 */
Tracker.sendPayload = function(allTrackers, payload, config, socket) {
    var sortedTrackers = [];
    for(var tracker in allTrackers) {
        sortedTrackers.push(allTrackers[tracker]);
    }

    //Sort the trackers and send the top n as set in the configuration file
    payload.trackers = sortedTrackers.sort(Tracker.sortByConnections).slice(0, config.totalTrackers);
    socket.sockets.json.send(payload);
};

module.exports = Tracker;