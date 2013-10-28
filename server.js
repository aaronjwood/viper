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
    "browser client": false,
    "transports": [
        "websocket",
        "flashsocket",
        "htmlfile",
        "xhr-polling",
        "jsonp-polling"
    ]
});
console.log("Client socket server created");

console.log("Creating dashboard socket server...");
var dashboardSocket = io.listen(viewServer, {
    "log level": 1,
    "browser client minification": true,
    "browser client etag": true,
    "transports": [
        "websocket",
        "flashsocket",
        "htmlfile",
        "xhr-polling",
        "jsonp-polling"
    ]
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

        //If a URL isn't sent over the socket then disregard this connection (connections can be manually crafted!)
        if (!data.url) {
            return;
        }

        client.userId = Util.generateUuid();
        client.url = data.url;

        payload.totalConnections++;

        var userData = {
            userId: client.userId,
            browserInfo: Util.getBrowserInfo(client.handshake.headers["user-agent"]),
            screenWidth: data.screenWidth,
            screenHeight: data.screenHeight
        };

        //Increment the appropriate browser count
        payload.browsers.count[userData.browserInfo.browser]++;
        var newUser = new User(userData);

        //If an object tracking the URL already exists then increment the number of connections and assign the new user
        if (allTrackers.hasOwnProperty(client.url)) {
            allTrackers[client.url].numConnections++;
            allTrackers[client.url].clients[client.userId] = newUser;
        }

        //Otherwise create a new tracker and user and assign it to the URL
        else {
            var newTracker = new Tracker(newUser, client.url);
            allTrackers[client.url] = newTracker;
            allTrackers[client.url].numConnections = 1;
        }

        //Get the string value for the screen resolution and add it to the payload if it doesn't exist
        var screenResolution = newUser.getScreenResolution();
        if (payload.screenResolutions.hasOwnProperty(screenResolution)) {
            payload.screenResolutions[screenResolution]++;
        }
        else {
            payload.screenResolutions[screenResolution] = 1;
        }

        //Add the OS to the payload if it doesn't 
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

        //Decrement the total connections
        payload.totalConnections--;

        //Get the appropriate tracker to work with
        var killedTracker = allTrackers[client.url].clients[client.userId];

        //Decrement the number of connections to a given URL
        allTrackers[client.url].numConnections--;

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
        if (allTrackers[client.url].numConnections == 0) {
            delete allTrackers[client.url];
        }

        //Otherwise remove the specific client
        else {
            delete allTrackers[client.url].clients[client.userId];
        }

        //Send the data back after manipulation
        Tracker.sendPayload(allTrackers, payload, config, dashboardSocket);

    });

});
