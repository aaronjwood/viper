module.exports = function (clientSocket, dashboardSocket) {
    var uuid = require("node-uuid");
    var Payload = require("../class/Payload.js");
    var Client = require("../class/Client.js");

    clientSocket.on("connection", function (client) {

        //A client will emit a beacon after it has connected to the server
        //The beacon's data will contain all the necessary tracking information
        client.on("beacon", function (data) {

            //If a URL isn't sent over the socket then disregard this connection
            //Connections can be manually crafted! Data can be manipulated!
            if (!data.url) {
                return;
            }

            client.userId = uuid.v4();
            client.url = data.url;

            var newClient = new Client({
                userId: client.userId,
                url: client.url,
                userAgent: client.request.headers["user-agent"],
                screenWidth: data.screenWidth,
                screenHeight: data.screenHeight,
                ip: client.request.connection.remoteAddress
            });

            Payload.addConnection();
            Payload.addBrowser(newClient.getBrowserInfo());
            Payload.addClient(newClient);
            Payload.addUrl(client.url);
            Payload.addScreenResolution(newClient.getScreenResolution());
            Payload.addOs(newClient.getBrowserInfo());

            Payload.send(Payload, dashboardSocket);
        });

        client.on("disconnect", function () {

            //There could be no URL associated with a client for many reasons
            //Race conditions
            //A client connecting and immediately disconnecting before their tracking data is sent
            if (!client.url) {
                return;
            }

            var killedTracker = Payload.allTrackers[client.url].clients[client.userId];

            Payload.removeConnection();
            Payload.removeBrowser(killedTracker.getBrowserInfo());
            Payload.removeScreenResolution(killedTracker.getScreenResolution());
            Payload.removeUrl(client.url);
            Payload.removeOs(killedTracker.getBrowserInfo());
            Payload.removeClient(client);

            Payload.send(Payload, dashboardSocket);
        });
    });
};
