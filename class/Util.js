var Util = function() {
};

/**
 * Generates a unique identifier to identify connected clients
 * @returns {String}
 */
Util.generateUuid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Determines information from the user agent and returns an object with useful tracking information
 * @param {String} The browser's user agent string
 * @returns {Object}
 */
Util.getBrowserInfo = function(userAgent) {
    var platform = "Other";
    var cellular = false;
    var browser = "Other";
    var os = "Other";

    //Detect cellular capabilities
    if (userAgent.match(/iPhone|Android|BlackBerry|Windows Phone/gi)) {
        cellular = true;
    }

    //Detect platform
    var platformTest = userAgent.match(/iPhone|iPad|Android|BlackBerry|RIM Tablet|BB10|Windows Phone/gi);
    if (platformTest) {
        if (platformTest.indexOf("iPhone") != -1 || platformTest.indexOf("iPad") != -1) {
            platform = "Apple";
            os = "iOS";
        }
        else if (platformTest.indexOf("Android") != -1) {
            platform = "Google";
        }
        else if (platformTest.indexOf("BlackBerry") != -1 || platformTest.indexOf("RIM Tablet") != -1 || platformTest.indexOf("BB10") != -1) {
            platform = "RIM";
            os = "BlackBerry OS";
        }
        else if (platformTest.indexOf("Windows Phone") != -1) {
            platform = "Microsoft";
        }
    }
    else {
        platform = "Other";
    }

    //Detect browser
    var browserTest = userAgent.match(/CriOS|Chrome|Firefox|MSIE|iPad|iPhone|Android|Opera|Safari/gi);
    if (browserTest) {
        if (browserTest.indexOf("CriOS") != -1 && (browserTest.indexOf("iPad") != -1 || browserTest.indexOf("iPhone") != -1)) {
            browser = "Chrome";
            platform = "Apple";
            os = "iOS";
        }
        else if (browserTest.indexOf("Chrome") != -1) {
            browser = "Chrome";
        }
        else if (browserTest.indexOf("Firefox") != -1) {
            browser = "Firefox";
        }
        else if (browserTest.indexOf("Opera") != -1) {
            browser = "Opera";
        }
        else if (browserTest.indexOf("MSIE") != -1) {
            browser = "IE";
            platform = "Microsoft";
        }
        else if (browserTest.indexOf("Android") != -1) {
            browser = "Android";
            platform = "Google";
        }
        else if (browserTest.indexOf("iPad") != -1) {
            browser = "iPad";
            platform = "Apple";
            os = "iOS";
        }
        else if (browserTest.indexOf("iPhone") != -1) {
            browser = "iPhone";
            platform = "Apple";
            os = "iOS";
        }
        else if (browserTest.indexOf("Safari") != -1 && browserTest.indexOf("Chrome") == -1) {
            browser = "Safari";
        }
    }
    else {
        browser = "Other";
    }

    //Detect operating system
    var osTest = userAgent.match(/Windows NT 5.0|Windows NT 5.1|Windows NT 6.0|Windows NT 6.1|Windows NT 6.2|Mac OS X|iPad|iPhone|Android|UNIX|Linux/gi);
    if (osTest) {
        if (osTest.indexOf("Windows NT 5.0") != -1) {
            os = "Windows 2000";
            platform = "Microsoft";
        }
        else if (osTest.indexOf("Windows NT 5.1") != -1) {
            os = "Windows XP";
            platform = "Microsoft";
        }
        else if (osTest.indexOf("Windows NT 6.0") != -1) {
            os = "Windows Vista";
            platform = "Microsoft";
        }
        else if (osTest.indexOf("Windows NT 6.1") != -1) {
            os = "Windows 7";
            platform = "Microsoft";
        }
        else if (osTest.indexOf("Windows NT 6.2") != -1) {
            os = "Windows 8";
            platform = "Microsoft";
        }
        else if (osTest.indexOf("iPad") != -1 || osTest.indexOf("iPhone") != -1) {
            os = "iOS";
            platform = "Apple";
        }
        else if (osTest.indexOf("Mac OS X") != -1) {
            os = "Mac OS X";
            platform = "Apple";
        }
        else if (osTest.indexOf("Android") != -1) {
            os = "Android";
            platform = "Google";
        }
        else if (osTest.indexOf("UNIX") != -1) {
            os = "Unix";
        }
        else if (osTest.indexOf("Linux") != -1) {
            os = "Linux";
        }
    }
    else if (!os) {
        os = "Other";
    }

    return {
        platform: platform,
        isCellular: cellular,
        browser: browser,
        os: os
    };
};

module.exports = Util;