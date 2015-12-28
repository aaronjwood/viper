"use strict";

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

}

//Holds all of the individual trackers
//Can be used to break down metrics for more fine grained information
Payload.allTrackers = {};

//Data that's globally accessible and not associated with any specific user
Payload.data = {
    totalConnections: 0,
    urls: {},
    browsers: {
        "Chrome": 0,
        "Firefox": 0,
        "Safari": 0,
        "Opera": 0,
        "IE": 0,
        "Android": 0,
        "iPad": 0,
        "iPhone": 0,
        "Other": 0
    },
    screenResolutions: {},
    os: {}
};

module.exports = Payload;