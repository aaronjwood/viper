"use strict";

var parser = require("ua-parser-js");

class Client {

    /**
     * Client class constructor
     * @param data Tracking data associated with a client
     */
    constructor(data) {
        this.id = data.userId;
        this.url = data.url;
        this.userAgent = data.userAgent;
        this.screenWidth = data.screenWidth;
        this.screenHeight = data.screenHeight;
        this.ip = data.ip;
    }

    /**
     * Determines information from the user agent and returns an object with useful tracking information
     * @param userAgent The browser's user agent string
     */
    getBrowserInfo() {
        return parser(this.userAgent);
    }

    /**
     * Takes the screen width and height and returns it as a resolution
     * @returns {string} Screen resolution
     */
    getScreenResolution() {
        return this.screenWidth + "x" + this.screenHeight;
    }
}

module.exports = Client;