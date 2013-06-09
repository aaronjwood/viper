var http = require("http");
var io = require("socket.io");
var client = require("node-static");
var config = require("./sys/config.js");
var Util = require("./class/Util.js");
var User = require("./class/User.js");
var Tracker = require("./class/Tracker.js");

//Static server to serve the dashboard
console.log("Creating dashboard server...");
var file = new (client.Server)('./public/');
var viewServer = http.createServer(function(req, res) {
    req.addListener('end', function() {
        file.serve(req, res);
    }).resume();
}).listen(config.dashboardPort);
console.log("Dashboard server created");

console.log("Creating client socket server...");
var clientSocket = io.listen(config.socketPort, {
    "log level": 1,
    "browser client": false
});
console.log("Client socket server created");

console.log("Creating dashboard socket server...");
var dashboardSocket = io.listen(viewServer, {
    "log level": 1,
    "browser client minification": true,
    "browser client etag": true
});
console.log("Dashboard socket server created");

//Object to hold all trackers
var allTrackers = {};

//Data that will be sent to the dashboard
var payload = {
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

dashboardSocket.sockets.on("connection", function() {

    //Immediately send stats to the dashboard upon request
    Tracker.sendPayload(allTrackers, payload, config, dashboardSocket);
});

clientSocket.sockets.on('connection', function(client) {

    //When a tracker emits a beacon then do necessary processing
    client.on('beacon', function(data) {
        
        //Make sure there's even a referer to work with
        //Don't process any requests without this. Treat them as tampered/malicious
        //The referer is necessary since it's used as an index into tracker arrays
        if(!client.handshake.headers.referer) {
            return;
        }

        payload.totalConnections++;

        //The client id uniquely identifies a user
        var userData = {
            sessionId: client.id,
            browserInfo: Util.getBrowserInfo(client.handshake.headers["user-agent"]),
            screenWidth: data.screenWidth,
            screenHeight: data.screenHeight,
        };

        //Increment the appropriate browser count
        payload.browsers.count[userData.browserInfo.browser]++;
        var newUser = new User(userData);

        //If an object tracking the URL already exists then increment the number of connections and assign the new user
        if (allTrackers.hasOwnProperty(client.handshake.headers.referer)) {
            allTrackers[client.handshake.headers.referer].numConnections++;
            allTrackers[client.handshake.headers.referer].clients[client.id] = newUser;
        }

        //Otherwise create a new tracker and user and assign it to the URL
        else {
            var newTracker = new Tracker(newUser, client.handshake.headers.referer);
            allTrackers[client.handshake.headers.referer] = newTracker;
            allTrackers[client.handshake.headers.referer].numConnections = 1;
        }

        //Get the string value for the screen resolution and add it to the payload if it doesn't exist
        var screenResolution = newUser.getScreenResolution();
        if (payload.screenResolutions.hasOwnProperty(screenResolution)) {
            payload.screenResolutions[screenResolution]++;
        }
        else {
            payload.screenResolutions[screenResolution] = 1;
        }

        //Add the OS to the payload if it doesn't exist
        if (payload.os.hasOwnProperty(userData.browserInfo.os)) {
            payload.os[userData.browserInfo.os]++;
        }
        else {
            payload.os[userData.browserInfo.os] = 1;
        }

        //Send the data back
        Tracker.sendPayload(allTrackers, payload, config, dashboardSocket);

    });

    client.on('disconnect', function() {
        
        //Make sure there's a referer
        //Avoid the race condition of a client connecting and disconnecting before their data is sent to the server
        //Avoid potential malicious/tampered requests that modify the referer
        if((!client.handshake.headers.referer || !allTrackers.hasOwnProperty(client.handshake.headers.referer))) {
            return;
        }
        
        //Decrement the total connections
        payload.totalConnections--;

        //Get the appropriate tracker to work with
        var killedTracker = allTrackers[client.handshake.headers.referer].clients[client.id];

        //Decrement the number of connections to a given URL
        allTrackers[client.handshake.headers.referer].numConnections--;

        //Decrement the appropriate browser count
        payload.browsers.count[killedTracker.browser]--;

        //Decrement the appropriate screen resolution count
        payload.screenResolutions[killedTracker.getScreenResolution()]--;

        //Remove the resolution if the count is 0
        if (payload.screenResolutions[killedTracker.getScreenResolution()] == 0) {
            delete payload.screenResolutions[killedTracker.getScreenResolution()];
        }

        //Decrement the appropriate operating system count
        payload.os[killedTracker.getOs()]--;

        //Remove the operating system if the count is 0
        if (payload.os[killedTracker.getOs()] == 0) {
            delete payload.os[killedTracker.getOs()];
        }

        //Remove the URL if there are no connections to it
        if (allTrackers[client.handshake.headers.referer].numConnections == 0) {
            delete allTrackers[client.handshake.headers.referer];
        }

        //Otherwise remove the specific client
        else {
            delete allTrackers[client.handshake.headers.referer].clients[client.id];
        }

        //Send the data back after manipulation
        Tracker.sendPayload(allTrackers, payload, config, dashboardSocket);
        
    });

});
