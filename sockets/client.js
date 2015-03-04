module.exports = function(clientSocket, dashboardSocket) {
    var config = require("../sys/config.js");
    var Payload = require("../class/Payload.js");
    var Client = require("../class/Client.js");
    var Tracker = require("../class/Tracker.js");

    clientSocket.on('connection', function(client) {

        //A client will emit a beacon after it has connected to the server
        //The beacon's data will contain all the necessary tracking information
        client.on('beacon', function(data) {

            //If a URL isn't sent over the socket then disregard this connection
            //Connections can be manually crafted! Data can be manipulated!
            if(!data.url) {
                return;
            }

            Payload.totalConnections++;
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
            Payload.browsers.count[newClient.browser]++;

            //If an object tracking the URL already exists then increment the number of connections and assign the new user
            //Otherwise create a new tracker and user and assign it to the URL
            if(Payload.allTrackers.hasOwnProperty(client.url)) {
                Payload.allTrackers[client.url].numConnections++;
                Payload.allTrackers[client.url].clients[client.userId] = newClient;
            }
            else {
                Payload.allTrackers[client.url] = new Tracker(newClient, client.url);
            }

            //Get the string value for the screen resolution and add it to the payload if it doesn't exist
            var screenResolution = newClient.getScreenResolution();
            if(Payload.screenResolutions.hasOwnProperty(screenResolution)) {
                Payload.screenResolutions[screenResolution]++;
            }
            else {
                Payload.screenResolutions[screenResolution] = 1;
            }

            //Add the OS to the payload if it doesn't
            if(Payload.os.hasOwnProperty(newClient.os)) {
                Payload.os[newClient.os]++;
            }
            else {
                Payload.os[newClient.os] = 1;
            }

            //Send the data back
            Tracker.sendPayload(Payload.allTrackers, Payload.payload, config, dashboardSocket);

        });

        client.on('disconnect', function() {

            //There could be no URL associated with a client for many reasons
            //Race conditions
            //A client connecting and immediately disconnecting before their tracking data is sent
            if(!client.url) {
                return;
            }

            //Decrement the total connections
            Payload.totalConnections--;

            //Get the appropriate tracker to work with
            var killedTracker = Payload.allTrackers[client.url].clients[client.userId];

            //Decrement the number of connections to a given URL
            Payload.allTrackers[client.url].numConnections--;

            //Decrement the appropriate browser count
            Payload.browsers.count[killedTracker.browser]--;

            //Decrement the appropriate screen resolution count
            Payload.screenResolutions[killedTracker.getScreenResolution()]--;

            //Remove the resolution if the count is 0
            if(Payload.screenResolutions[killedTracker.getScreenResolution()] === 0) {
                delete Payload.screenResolutions[killedTracker.getScreenResolution()];
            }

            //Decrement the appropriate operating system count
            Payload.os[killedTracker.os]--;

            //Remove the operating system if the count is 0
            if(Payload.os[killedTracker.os] === 0) {
                delete Payload.os[killedTracker.os];
            }

            //Remove the URL if there are no connections to it
            //Otherwise remove the specific client
            if(Payload.allTrackers[client.url].numConnections === 0) {
                delete Payload.allTrackers[client.url];
            }
            else {
                delete Payload.allTrackers[client.url].clients[client.userId];
            }

            //Send the data back after manipulation
            Tracker.sendPayload(Payload.allTrackers, Payload.payload, config, dashboardSocket);

        });

    });

};
