"use strict";

class Payload {
}

Payload.allTrackers = {};
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