"use strict";

class Client {

    /**
     * Client class constructor
     * @param data Tracking data associated with a client
     */
    constructor(data) {
        this.id = data.userId;
        this.url = data.url;
        this.screenWidth = data.screenWidth;
        this.screenHeight = data.screenHeight;
        this.os = data.browserInfo.os;
        this.ip = data.ip;

        this.getBrowserInfo(data.browserInfo);
    }

    /**
     * Determines information from the user agent and returns an object with useful tracking information
     * @param userAgent The browser's user agent string
     */
    getBrowserInfo(userAgent) {
        this.platform = this.detectPlatform(userAgent);
        this.browser = this.detectBrowser(userAgent);
        this.os = this.detectOs(userAgent);
    }

    detectPlatform(userAgent) {
        var platform = "Other";
        var platformTest = userAgent.match(/iPhone|iPad|Android|BlackBerry|RIM Tablet|BB10|Windows Phone/gi);

        if (platformTest) {
            if (platformTest.indexOf("iPhone") !== -1 || platformTest.indexOf("iPad") !== -1) {
                platform = "Apple";
            }
            else if (platformTest.indexOf("Android") !== -1) {
                platform = "Google";
            }
            else if (platformTest.indexOf("BlackBerry") !== -1 || platformTest.indexOf("RIM Tablet") !== -1 || platformTest.indexOf("BB10") !== -1) {
                platform = "RIM";
            }
            else if (platformTest.indexOf("Windows Phone") !== -1) {
                platform = "Microsoft";
            }
        }

        return platform;
    }

    detectBrowser(userAgent) {
        var browser = "Other";
        var browserTest = userAgent.match(/CriOS|Chrome|Firefox|MSIE|iPad|iPhone|Android|Opera|Safari/gi);

        if (browserTest) {
            if (browserTest.indexOf("CriOS") !== -1 && (browserTest.indexOf("iPad") !== -1 || browserTest.indexOf("iPhone") !== -1)) {
                browser = "Chrome";
            }
            else if (browserTest.indexOf("Chrome") !== -1) {
                browser = "Chrome";
            }
            else if (browserTest.indexOf("Firefox") !== -1) {
                browser = "Firefox";
            }
            else if (browserTest.indexOf("Opera") !== -1) {
                browser = "Opera";
            }
            else if (browserTest.indexOf("MSIE") !== -1) {
                browser = "IE";
            }
            else if (browserTest.indexOf("Android") !== -1) {
                browser = "Android";
            }
            else if (browserTest.indexOf("iPad") !== -1) {
                browser = "iPad";
            }
            else if (browserTest.indexOf("iPhone") !== -1) {
                browser = "iPhone";
            }
            else if (browserTest.indexOf("Safari") !== -1 && browserTest.indexOf("Chrome") === -1) {
                browser = "Safari";
            }
        }

        return browser;
    }

    detectOs(userAgent) {
        var os = "Unknown";
        var osTest = userAgent.match(/Windows NT 5.0|Windows NT 5.1|Windows NT 6.0|Windows NT 6.1|Windows NT 6.2|Mac OS X|iPad|iPhone|Android|UNIX|Linux/gi);

        if (osTest) {
            if (osTest.indexOf("Windows NT 5.0") !== -1) {
                os = "Windows 2000";
            }
            else if (osTest.indexOf("Windows NT 5.1") !== -1) {
                os = "Windows XP";
            }
            else if (osTest.indexOf("Windows NT 6.0") !== -1) {
                os = "Windows Vista";
            }
            else if (osTest.indexOf("Windows NT 6.1") !== -1) {
                os = "Windows 7";
            }
            else if (osTest.indexOf("Windows NT 6.2") !== -1) {
                os = "Windows 8";
            }
            else if (osTest.indexOf("iPad") !== -1 || osTest.indexOf("iPhone") !== -1) {
                os = "iOS";
            }
            else if (osTest.indexOf("Mac OS X") !== -1) {
                os = "Mac OS X";
            }
            else if (osTest.indexOf("Android") !== -1) {
                os = "Android";
            }
            else if (osTest.indexOf("UNIX") !== -1) {
                os = "Unix";
            }
            else if (osTest.indexOf("Linux") !== -1) {
                os = "Linux";
            }
        }

        return os;
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