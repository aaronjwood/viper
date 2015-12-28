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
}

module.exports = Tracker;