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

var socket = io.listen(viewServer, {
	"log level": 0
});

//Object to hold all trackers
var allTrackers = {};

//Data that will be sent to the dashboard
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
	trackers: [],
	screenResolutions: {},
	os: {}
};

socket.sockets.on('connection', function(client) {
	//Immediately send any data available upon connection
	Tracker.sendPayload(allTrackers, payload, config, socket);
	
	//When a tracker emits a beacon then do necessary processing
	client.on('beacon', function(data) {
		payload.totalConnections++;
		client["url"] = data.url;
		
		//The client id uniquely identifies a user
		var userData = {
				"sessionId": client.id,
				"browser": Util.getBrowser(data.browser),
				"screenWidth": data.screenWidth,
				"screenHeight": data.screenHeight,
				"os": Util.getOs(data.os)
		};
		
		//Increment the appropriate browser count
		payload.browsers.count[userData.browser]++;
		var newUser = new User(userData);
		
		//If an object tracking the URL already exists then increment the number of connections and assign the new user
		if(allTrackers[data.url]) {
			allTrackers[data.url].numConnections++;
			allTrackers[data.url].clients[client.id] = newUser;
		}
		
		//Otherwise create a new tracker and user and assign it to the URL
		else {
			var newTracker = new Tracker(newUser, data.url);
			allTrackers[data.url] = newTracker;
			allTrackers[data.url].numConnections = 1;
		}
		
		//Get the string value for the screen resolution and add it to the payload if it doesn't exist
		var screenResolution = newUser.getScreenResolution();
		if(payload.screenResolutions[screenResolution]) {
			payload.screenResolutions[screenResolution]++;
		}
		else {
			payload.screenResolutions[screenResolution] = 1;
		}
		
		//Add the OS to the payload if it doesn't exist
		if(payload.os[userData.os]) {
			payload.os[userData.os]++;
		}
		else {
			payload.os[userData.os] = 1;
		}
		
		//Send the data back
		Tracker.sendPayload(allTrackers, payload, config, socket);
	});
	
	client.on('disconnect', function() {
		
		//Get the appropriate tracker to work with
		if(allTrackers[client.url]) {
			var killedTracker = allTrackers[client.url].clients[client.id];
			
			//TODO can we detect disconnections only from a certain socket? We don't want to trigger this for dashboard disconnects
			//Decrement the total connections
			payload.totalConnections--;
			
			//Decrement the number of connections to a given URL
			allTrackers[client.url].numConnections--;
			
			//Decrement the appropriate browser count
			payload.browsers.count[killedTracker.browser]--;
			
			//Decrement the appropriate screen resolution count
			payload.screenResolutions[killedTracker.getScreenResolution()]--;
			
			//Remove the resolution if the count is 0
			if(payload.screenResolutions[killedTracker.getScreenResolution()] == 0) {
				delete payload.screenResolutions[killedTracker.getScreenResolution()];
			}
			
			//Decrement the appropriate operating system count
			payload.os[killedTracker.getOs()]--;
			
			//Remove the operating system if the count is 0
			if(payload.os[killedTracker.getOs()] == 0) {
				delete payload.os[killedTracker.getOs()];
			}
			
			//Remove the URL if there are no connections to it
			if(allTrackers[client.url].numConnections == 0) {
				delete allTrackers[client.url];
			}
			
			//Otherwise remove the specific client
			else {
				delete allTrackers[client.url].clients[client.id];
			}
		}
		
		//Send the data back after manipulation
		Tracker.sendPayload(allTrackers, payload, config, socket);
	});
	
});
