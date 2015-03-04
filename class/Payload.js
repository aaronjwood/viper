"use strict";

/**
 * Payload object
 * @constructor
 */
var Payload = function() {
};

Payload.allTrackers = {};
Payload.payload = {
    totalConnections: 0,
    browsers: {
        count: {
            "Chrome": 0,
            "Firefox": 0,
            "Safari": 0,
            "Opera": 0,
            "IE": 0,
            "Android": 0,
            "iPad": 0,
            "iPhone": 0,
            "Other": 0
        }
    },
    trackers: [],
    screenResolutions: {},
    os: {}
};

module.exports = Payload;