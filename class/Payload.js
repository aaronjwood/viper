"use strict";

var Tracker = require("../class/Tracker.js");

class Payload {

    /**
     * Sorts the trackers and sends the configured number of trackers back over the socket
     * @param tracker Main payload that the client/server uses and transfers
     * @param config Configuration settings object
     * @param socket Socket object used to push data back
     */
    static send(tracker, socket) {
        socket.sockets.json.send(tracker.data);
    }

    static addClient(client) {
        if (Payload.allTrackers.hasOwnProperty(client.url)) {
            Payload.allTrackers[client.url].numConnections++;
            Payload.allTrackers[client.url].clients[client.id] = client;
        }
        else {
            Payload.allTrackers[client.url] = new Tracker(client, client.url);
        }
    }

    static removeClient(client) {
        Payload.allTrackers[client.url].numConnections--;

        if (Payload.allTrackers[client.url].numConnections === 0) {
            delete Payload.allTrackers[client.url];
        }
        else {
            delete Payload.allTrackers[client.url].clients[client.userId];
        }
    }

    static addUrl(url) {
        if (Payload.data.urls.hasOwnProperty(url)) {
            Payload.data.urls[url]++;
        }
        else {
            Payload.data.urls[url] = 1;
        }
    }

    static removeUrl(url) {
        Payload.data.urls[url]--;

        if (Payload.data.urls[url] === 0) {
            delete Payload.data.urls[url];
        }
    }

    static addBrowser(data) {
        if (Payload.data.browsers.hasOwnProperty(data.browser.name)) {
            Payload.data.browsers[data.browser.name]++;
        }
        else {
            Payload.data.browsers[data.browser.name] = 1;
        }
    }

    static removeBrowser(data) {
        Payload.data.browsers[data.browser.name]--;

        if (Payload.data.browsers[data.browser.name] === 0) {
            delete Payload.data.browsers[data.browser.name];
        }
    }

    static addConnection() {
        Payload.data.totalConnections++;
    }

    static removeConnection() {
        Payload.data.totalConnections--;
    }

    static addScreenResolution(resolution) {
        if (Payload.data.screenResolutions.hasOwnProperty(resolution)) {
            Payload.data.screenResolutions[resolution]++;
        }
        else {
            Payload.data.screenResolutions[resolution] = 1;
        }
    }

    static removeScreenResolution(resolution) {
        Payload.data.screenResolutions[resolution]--;

        if (Payload.data.screenResolutions[resolution] === 0) {
            delete Payload.data.screenResolutions[resolution];
        }
    }

    static addOs(os) {
        if (Payload.data.os.hasOwnProperty(os)) {
            Payload.data.os[os]++;
        }
        else {
            Payload.data.os[os] = 1;
        }
    }

    static removeOs(os) {
        Payload.data.os[os]--;

        //Remove the operating system if the count is 0
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