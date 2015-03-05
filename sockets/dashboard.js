module.exports = function(socket) {
    var config = require("../sys/config.js");
    var Tracker = require("../class/Tracker.js");
    var Payload = require("../class/Payload.js");

    socket.on("connection", function() {

        //Immediately send stats to the dashboard upon request
        Tracker.sendPayload(Payload, config, socket);
    });
};
