"use strict";

var Tracker = require("../class/Tracker.js");

class Payload {

    /**
     * Sorts the trackers and sends the configured number of trackers back over the socket
     * @param tracker Main payload that the client/server uses and transfers
     * @param socket Socket object used to push data back
     */
    static send(tracker, socket) {
        socket.sockets.json.send(tracker.data);
    }

    /**
     * Adds a client to the payload, sometimes adding a new tracker with the new client
     * @param client Client data object
     */
    static addClient(client) {
        if (Payload.allTrackers.hasOwnProperty(client.url)) {
            Payload.allTrackers[client.url].numConnections++;
            Payload.allTrackers[client.url].clients[client.id] = client;
        }
        else {
            Payload.allTrackers[client.url] = new Tracker(client, client.url);
        }
    }

    /**
     * Removes a client from the payload, sometimes removing a tracker if no more clients are associated with it
     * @param client Client data object
     */
    static removeClient(client) {
        Payload.allTrackers[client.url].numConnections--;

        if (Payload.allTrackers[client.url].numConnections === 0) {
            delete Payload.allTrackers[client.url];
        }
        else {
            delete Payload.allTrackers[client.url].clients[client.userId];
        }
    }

    /**
     * Adds a URL to the payload
     * @param url
     */
    static addUrl(url) {
        if (Payload.data.urls.hasOwnProperty(url)) {
            Payload.data.urls[url]++;
        }
        else {
            Payload.data.urls[url] = 1;
        }
    }

    /**
     * Removes a URL from the payload
     * @param url
     */
    static removeUrl(url) {
        Payload.data.urls[url]--;

        if (Payload.data.urls[url] === 0) {
            delete Payload.data.urls[url];
        }
    }

    /**
     * Adds a browser name to the payload
     * @param data User agent data object
     */
    static addBrowser(data) {
        if (Payload.data.browsers.hasOwnProperty(data.browser.name)) {
            Payload.data.browsers[data.browser.name]++;
        }
        else {
            Payload.data.browsers[data.browser.name] = 1;
        }
    }

    /**
     * Removes a browser name from the payload
     * @param data User agent data object
     */
    static removeBrowser(data) {
        Payload.data.browsers[data.browser.name]--;

        if (Payload.data.browsers[data.browser.name] === 0) {
            delete Payload.data.browsers[data.browser.name];
        }
    }

    /**
     * Increments the total number of connections
     */
    static addConnection() {
        Payload.data.totalConnections++;
    }

    /**
     * Decrements the total number of connections
     */
    static removeConnection() {
        Payload.data.totalConnections--;
    }

    /**
     * Adds a screen resolution to the payload
     * @param resolution Screen resolution
     */
    static addScreenResolution(resolution) {
        if (Payload.data.screenResolutions.hasOwnProperty(resolution)) {
            Payload.data.screenResolutions[resolution]++;
        }
        else {
            Payload.data.screenResolutions[resolution] = 1;
        }
    }

    /**
     * Removes a screen resolution from the payload
     * @param resolution Screen resolution
     */
    static removeScreenResolution(resolution) {
        Payload.data.screenResolutions[resolution]--;

        if (Payload.data.screenResolutions[resolution] === 0) {
            delete Payload.data.screenResolutions[resolution];
        }
    }

    /**
     * Adds an operating system to the payload
     * @param os Operating system to be added
     */
    static addOs(os) {
        if (Payload.data.os.hasOwnProperty(os)) {
            Payload.data.os[os]++;
        }
        else {
            Payload.data.os[os] = 1;
        }
    }

    /**
     * Removes an operating system from the payload
     * @param os Operating system to be removed
     */
    static removeOs(os) {
        Payload.data.os[os]--;

        if (Payload.data.os[os] === 0) {
            delete Payload.data.os[os];
        }
    }

}

//Holds all of the individual trackers
//Can be used to break down metrics for more fine grained information
Payload.allTrackers = {};

//Data that's globally accessible and not associated with any specific user
Payload.data = {
    totalConnections: 0,
    urls: {},
    browsers: {},
    screenResolutions: {},
    os: {}
};

module.exports = Payload;