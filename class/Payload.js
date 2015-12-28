"use strict";

class Payload {
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