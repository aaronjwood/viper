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
     * Adds data to the payload
     * @param data Array of objects that specify what data to add
     */
    static addData(data) {
        for (var i = 0; i < data.length; i++) {
            if (Payload.data[data[i].type].hasOwnProperty(data[i].value)) {
                Payload.data[data[i].type][data[i].value]++
            }
            else {
                Payload.data[data[i].type][data[i].value] = 1;
            }
        }
    }

    /**
     * Removes data from the payload
     * @param data Array of objects that specify what data to remove
     */
    static removeData(data) {
        for (var i = 0; i < data.length; i++) {
            Payload.data[data[i].type][data[i].value]--;

            if (Payload.data[data[i].type][data[i].value] === 0) {
                delete Payload.data[data[i].type][data[i].value];
            }
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