"use strict";

var express = require("express");
var compression = require("compression");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var http = require("http");
var io = require("socket.io");

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
server.listen(3000);

require("./socket.js")(socket);
