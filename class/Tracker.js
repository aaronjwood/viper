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
     * Sorts the trackers and sends the configured number of trackers back over the socket
     * @param tracker Main payload that the client/server uses and transfers
     * @param config Configuration settings object
     * @param socket Socket object used to push data back
     */
    static sendPayload(tracker, config, socket) {
        socket.sockets.json.send(tracker.data);
    }
}

module.exports = Tracker;