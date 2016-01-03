module.exports = function (socket) {
    var Payload = require("../class/Payload.js");
    var dashboardSocket = socket.of("/dashboard");

    dashboardSocket.on("connection", function () {

        //Immediately send stats to the dashboard upon request
        Payload.send(Payload, socket);
    });
};
