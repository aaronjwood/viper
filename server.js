var http = require('http');
var io = require('socket.io');
var client = require('node-static');
var config = require('./sys/config.js');
var Util = require('./class/Util.js');
var User = require('./class/User.js');
var Tracker = require('./class/Tracker.js');

//Static server to serve the dashboard
var file = new(client.Server)('./public/');
var viewServer = http.createServer(function(req, res) {
	req.addListener('end', function() {
		file.serve(req, res);
	});
}).listen(config.port);

var socket = io.listen(viewServer);

var allTrackers = {};

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
	trackers: allTrackers,
	screenResolutions: {},
	os: {}
};

//Keep track of the most recently accessed URL
var clientUrl;

socket.sockets.on('connection', function(client) {
	//Immediately send any data available upon connection
	Tracker.sendPayload(allTrackers, payload, config, socket);
	
	client.on('message', function(data) {
		payload.totalConnections++;
		var trackingData = JSON.parse(data);
		clientUrl = trackingData.url;
		
		//The client id uniquely identifies a user
		var userData = {
				"sessionId": client.id,
				"browser": Util.getBrowser(trackingData.browser),
				"screenWidth": trackingData.screenWidth,
				"screenHeight": trackingData.screenHeight,
				"os": Util.getOs(trackingData.os)
		};
		payload.browsers.count[userData.browser]++;
		var newUser = new User(userData);
		if(allTrackers[trackingData.url]) {
			allTrackers[trackingData.url].numConnections++;
			allTrackers[trackingData.url].clients[client.id] = newUser;
		}
		else {
			var newTracker = new Tracker(newUser, trackingData.url);
			allTrackers[trackingData.url] = newTracker;
			allTrackers[trackingData.url].numConnections = 1;
		}
		//Get the string value for the screen resolution and add it to the payload if it doesn't exist
		var screenResolution = newUser.getScreenResolution();
		if(typeof payload.screenResolutions[screenResolution] === "undefined") {
			payload.screenResolutions[screenResolution] = 1;
		}
		else {
			payload.screenResolutions[screenResolution]++;
		}
		//Add the OS to the payload if it doesn't exist
		if(typeof payload.os[userData.os] === "undefined") {
			payload.os[userData.os] = 1;
		}
		else {
			payload.os[userData.os]++;
		}
		
		//Send the data back
		Tracker.sendPayload(allTrackers, payload, config, socket);
	});
	
	client.on('disconnect', function() {
		//Get the appropriate tracker to work with
		var killedTracker = allTrackers[clientUrl].clients[client.id];
		//TODO can we detect disconnections only from a certain socket? We don't want to trigger this for dashboard disconnects
		if(killedTracker) {
			//Decrement the total connections
			payload.totalConnections--;
			//Decrement the number of connections to a given URL
			allTrackers[clientUrl].numConnections--;
			//Decrement the appropriate browser count
			payload.browsers.count[killedTracker.browser]--;
			//Decrement the appropriate screen resolution count
			payload.screenResolutions[killedTracker.getScreenResolution()]--;
			//Decrement the appropriate operating system count
			payload.os[killedTracker.getOs()]--;
			//Remove the actual client
			delete allTrackers[clientUrl].clients[client.id];
		}
		
		//Send the data back after manipulation
		Tracker.sendPayload(allTrackers, payload, config, socket);
	});
	
});
