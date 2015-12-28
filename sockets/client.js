module.exports = function(clientSocket, dashboardSocket) {
    var uuid = require("node-uuid");
    var Payload = require("../class/Payload.js");
    var Client = require("../class/Client.js");
    var Tracker = require("../class/Tracker.js");

    clientSocket.on("connection", function(client) {

        //A client will emit a beacon after it has connected to the server
        //The beacon's data will contain all the necessary tracking information
        client.on("beacon", function(data) {

            //If a URL isn't sent over the socket then disregard this connection
            //Connections can be manually crafted! Data can be manipulated!
            if(!data.url) {
                return;
            }

            Payload.addConnection();
            client.userId = uuid.v4();
            client.url = data.url;

            var newClient = new Client({
                userId: client.userId,
                url: client.url,
                browserInfo: client.request.headers["user-agent"],
                screenWidth: data.screenWidth,
                screenHeight: data.screenHeight,
                ip: client.request.connection.remoteAddress
            });

            Payload.addBrowser(newClient.browser);

            //If an object tracking the URL already exists then increment the number of connections and assign the new user
            //Otherwise create a new tracker and user and assign it to the URL
            if(Payload.allTrackers.hasOwnProperty(client.url)) {
                Payload.allTrackers[client.url].numConnections++;
                Payload.allTrackers[client.url].clients[client.userId] = newClient;
            }
            else {
                Payload.allTrackers[client.url] = new Tracker(newClient, client.url);
            }

            Payload.addUrl(client.url);
            Payload.addScreenResolution(newClient.getScreenResolution());
            Payload.addOs(newClient.os);

            Payload.send(Payload, dashboardSocket);
        });

        client.on("disconnect", function() {

            //There could be no URL associated with a client for many reasons
            //Race conditions
            //A client connecting and immediately disconnecting before their tracking data is sent
            if(!client.url) {
                return;
            }

            //Get the appropriate tracker to work with
            var killedTracker = Payload.allTrackers[client.url].clients[client.userId];

            Payload.removeConnection();

            //Decrement the number of connections to a given URL
            Payload.allTrackers[client.url].numConnections--;

            Payload.removeBrowser(killedTracker.browser);
            Payload.removeScreenResolution(killedTracker.getScreenResolution());
            Payload.removeUrl(client.url);
            Payload.removeOs(killedTracker.os);

            //Remove the URL if there are no connections to it
            //Otherwise remove the specific client
            if(Payload.allTrackers[client.url].numConnections === 0) {
                delete Payload.allTrackers[client.url];
            }
            else {
                delete Payload.allTrackers[client.url].clients[client.userId];
            }

            //Send the data back after manipulation
            Payload.send(Payload, dashboardSocket);

        });
    });
};
