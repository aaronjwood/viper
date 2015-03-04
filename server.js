"use strict";

var express = require("express");
var compression = require("compression");
var bodyParser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var load = require("express-load");
var http = require("http");
var io = require("socket.io");
var geoip = require("geoip-lite");
var config = require("./sys/config.js");

var dashboard = express();

dashboard
    .use(compression())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
    .use(cookieParser())
    .use(express.static(__dirname + "/public"));

var dashboardServer = http.Server(dashboard);
var dashboardSocket = io(dashboardServer);
dashboardServer.listen(config.dashboardPort);

var clientServer = http.Server();
var clientSocket = io(clientServer);
clientServer.listen(config.socketPort);

require("./sockets/dashboard.js")(dashboardSocket);
require("./sockets/client.js")(clientSocket, dashboardSocket);

load("routes").into(dashboard);
