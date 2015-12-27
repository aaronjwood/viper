"use strict";

class Tracker {
    /**
     * Tracker class constructor
     * @param client Data from the client containing tracking information
     * @param url URL that all clients are associated with
     */
    constructor(client, url) {
        this.clients = {};
        this.url = url;
        this.clients[client.id] = client;
        this.numConnections = 1;
    }

    /**
     * Sort trackers by connections descending
     * @param tracker1 First tracker used in comparison
     * @param tracker2 Second tracker used in comparison
     * @returns {number} Sorted trackers
     */
    static sortByConnections(tracker1, tracker2) {
        return tracker2.numConnections - tracker1.numConnections;
    }

    /**
     * Sorts the trackers and sends the configured number of trackers back over the socket
     * @param tracker Main payload that the client/server uses and transfers
     * @param config Configuration settings object
     * @param socket Socket object used to push data back
     */
    static sendPayload(tracker, config, socket) {
        var sortedTrackers = [];
        for (var t in tracker.allTrackers) {
            sortedTrackers.push(tracker.allTrackers[t]);
        }

        //Sort the trackers and send the top n as set in the configuration file
        tracker.data.trackers = sortedTrackers.sort(Tracker.sortByConnections).slice(0, config.totalTrackers);
        socket.sockets.json.send(tracker.data);
    }
}

module.exports = Tracker;