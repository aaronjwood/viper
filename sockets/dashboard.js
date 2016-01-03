module.exports = function (socket) {
    var Payload = require("../class/Payload.js");
    var namespacedSocket = socket.of("/dashboard");

    namespacedSocket.on("connection", function () {

        //Immediately send stats to the dashboard upon request
        Payload.send(Payload, socket);
    });
};
