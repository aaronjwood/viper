"use strict";

var express = require("express");
var compression = require("compression");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var http = require("http");
var io = require("socket.io");
var config = require("./sys/config.js");

var app = express();

app
    .use(compression())
    .use(bodyParser.urlencoded({
        extended: true
    }))
    .use(bodyParser.json())
    .use(cookieParser())
    .use(express.static(__dirname + "/public"));

var server = http.Server(app);
var socket = io(server);
server.listen(config.dashboardPort);

require("./sockets/dashboard.js")(socket);
require("./sockets/client.js")(socket);
