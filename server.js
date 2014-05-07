var http = require("http");
var io = require("socket.io");
var client = require("node-static");
var geoip = require("geoip-lite");
var config = require("./sys/config.js");
var Client = require("./class/Client.js");
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

//Websocket server
console.log("Creating client socket server...");
var clientServer = http.Server();
var clientSocket = io(clientServer);
clientServer.listen(config.socketPort);
console.log("Client socket server created");

//Dashboard server
console.log("Creating dashboard socket server...");
var dashboardServer = viewServer;
var dashboardSocket = io(dashboardServer);
dashboardServer.listen(viewServer);
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

dashboardSocket.on("connection", function() {

    //Immediately send stats to the dashboard upon request
    Tracker.sendPayload(allTrackers, payload, config, dashboardSocket);
});

clientSocket.on('connection', function(client) {

    //A client will emit a beacon after it has connected to the server
    //The beacon's data will contain all the necessary tracking information
    client.on('beacon', function(data) {

        //If a URL isn't sent over the socket then disregard this connection
        //Connections can be manually crafted! Data can be manipulated!
        if(!data.url) {
            return;
        }

        payload.totalConnections++;
        client.userId = Client.generateUuid();
        client.url = data.url;

        var newClient = new Client({
            userId: client.userId,
            url: client.url,
            browserInfo: client.request.headers["user-agent"],
            screenWidth: data.screenWidth,
            screenHeight: data.screenHeight,
            ip: client.request.connection.remoteAddress
        });

        //Increment the appropriate browser count
        payload.browsers.count[newClient.browser]++;

        //If an object tracking the URL already exists then increment the number of connections and assign the new user
        //Otherwise create a new tracker and user and assign it to the URL
        if(allTrackers.hasOwnProperty(client.url)) {
            allTrackers[client.url].numConnections++;
            allTrackers[client.url].clients[client.userId] = newClient;
        }
        else {
            allTrackers[client.url] = new Tracker(newClient, client.url);
            allTrackers[client.url].numConnections = 1;
        }

        //Get the string value for the screen resolution and add it to the payload if it doesn't exist
        var screenResolution = newClient.getScreenResolution();
        if(payload.screenResolutions.hasOwnProperty(screenResolution)) {
            payload.screenResolutions[screenResolution]++;
        }
        else {
            payload.screenResolutions[screenResolution] = 1;
        }

        //Add the OS to the payload if it doesn't 
        if(payload.os.hasOwnProperty(newClient.os)) {
            payload.os[newClient.os]++;
        }
        else {
            payload.os[newClient.os] = 1;
        }

        //Send the data back
        Tracker.sendPayload(allTrackers, payload, config, dashboardSocket);

    });

    client.on('disconnect', function() {

        //There could be no URL associated with a client for many reasons
        //Race conditions
        //A client connecting and immediately disconnecting before their tracking data is sent
        if(!client.url) {
            return;
        }

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
        if(payload.screenResolutions[killedTracker.getScreenResolution()] === 0) {
            delete payload.screenResolutions[killedTracker.getScreenResolution()];
        }

        //Decrement the appropriate operating system count
        payload.os[killedTracker.os]--;

        //Remove the operating system if the count is 0
        if(payload.os[killedTracker.os] === 0) {
            delete payload.os[killedTracker.os];
        }

        //Remove the URL if there are no connections to it
        //Otherwise remove the specific client
        if(allTrackers[client.url].numConnections === 0) {
            delete allTrackers[client.url];
        }
        else {
            delete allTrackers[client.url].clients[client.userId];
        }

        //Send the data back after manipulation
        Tracker.sendPayload(allTrackers, payload, config, dashboardSocket);

    });

});
