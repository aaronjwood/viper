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
});
viewServer.listen(config.port);

var socket = io.listen(viewServer);

var allTrackers = [];

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
	
	client.on('message', function(data) {
		payload.totalConnections++;
		var trackingData = JSON.parse(data);
		var trackerExists = false;
		for(var i = 0; i < allTrackers.length; i++) {
			var newTracker = allTrackers[i];
			//If an object already exists with the same URL, don't create a new one!
			if(newTracker.url == trackingData.url) {
				trackerExists = true;
				newTracker.numConnections++;
				//Set up an object to hold the data being tracked
				var userData = {
						"sessionId": client.id, //We need the session id to accurately increment or decrement the number of connections to a given URL
						"browser": Util.getBrowser(trackingData.browser),
						"screenWidth": trackingData.screenWidth,
						"screenHeight": trackingData.screenHeight,
						"os": Util.getOs(trackingData.os)
				};
				payload.browsers.count[userData.browser]++;
                var newUser = new User(userData);
				newTracker.clients.push(newUser);
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
			}
		}
		
		//Otherwise, create a new user/tracker, set the appropriate values, and increment the browser count
		if(!trackerExists) {
			//Set up an object to hold the data being tracked
			var userData = {
					"sessionId": client.id, //We need the session id to accurately increment or decrement the number of connections to a given URL
					"browser": Util.getBrowser(trackingData.browser),
					"screenWidth": trackingData.screenWidth,
					"screenHeight": trackingData.screenHeight,
					"os": Util.getOs(trackingData.os)
			};
			payload.browsers.count[userData.browser]++;
			var newUser = new User(userData);
            var newTracker = new Tracker(newUser, trackingData.url, 1);
			allTrackers.push(newTracker);
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
		}
		
		//Send the data back
		Tracker.sendPayload(allTrackers, payload, config, socket);
	});
	
	client.on('disconnect', function() {
        //TODO monitor this for potential future performance issues when dealing with large amounts of traffic
		for(var i = 0; i < allTrackers.length; i++) {
            //Loop through all the trackers and then all of the sessId objects to find the right client id
            for(var c = 0; c < allTrackers[i].clients.length; c++) {
                if(allTrackers[i].clients[c].id == client.id) {
                    var killedTracker = allTrackers[i];
                    payload.totalConnections--;
                    killedTracker.numConnections--;
                    payload.browsers.count[killedTracker.clients[c].browser]--;
                    //Get the string value of the user's screen resolution
                    var screenResolution = killedTracker.clients[c].getScreenResolution();
                    //Decrement the count in the payload for the appropriate resolution
                    payload.screenResolutions[screenResolution]--;
                    //Get the OS
                    var os = killedTracker.clients[c].getOs();
                    //Decrement the count in the payload for the appropriate OS
                    payload.os[os]--;
                    //Remove the user object from the array
                    killedTracker.clients.splice(c, 1);
                }
            }
		}
		
		//Send the data back
		Tracker.sendPayload(allTrackers, payload, config, socket);
	});
	
});
