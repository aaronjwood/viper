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
	screenResolutions: {}
};

socket.sockets.on('connection', function(client) {
	//Immediately sort and send any data available upon connection
	payload.trackers.sort(Tracker.sortByConnections);
	socket.sockets.json.send(payload);
	
	client.on('message', function(msg) {
		payload.totalConnections++;
		var trackingData = JSON.parse(msg);
		var exists = false;
		for(var i = 0; i < payload.trackers.length; i++) {
			var newTracker = payload.trackers[i];
			//If an object already exists with the same URL, don't create a new one!
			if(newTracker.url == trackingData.url) {
				exists = true;
				newTracker.numConnections++;
				payload.browsers.count[Util.getBrowser(trackingData.browser)]++;
				//We need the client's session id to accurately increment or decrement the number of connections to a given URL
                var newUser = new User(client.id, Util.getBrowser(trackingData.browser), trackingData.screenWidth, trackingData.screenHeight);
				newTracker.clients.push(newUser);
				//Get the string value for the screen resolution and add it to the payload if it doesn't exist
				var screenResolution = newUser.getScreenResolution();
				if(typeof payload.screenResolutions[screenResolution] === "undefined") {
					payload.screenResolutions[screenResolution] = 1;
				}
				else {
					payload.screenResolutions[screenResolution]++;
				}
			}
		}
		
		//Otherwise, create a new user/tracker, set the appropriate values, and increment the browser count
		if(!exists) {
            var newUser = new User(client.id, Util.getBrowser(trackingData.browser), trackingData.screenWidth, trackingData.screenHeight);
            var newTracker = new Tracker(newUser, trackingData.url, 1);
			payload.trackers.push(newTracker);
			payload.browsers.count[Util.getBrowser(trackingData.browser)]++;
			//Get the string value for the screen resolution and add it to the payload if it doesn't exist
			var screenResolution = newUser.getScreenResolution();
			if(typeof payload.screenResolutions[screenResolution] === "undefined") {
				payload.screenResolutions[screenResolution] = 1;
			}
			else {
				payload.screenResolutions[screenResolution]++;
			}
		}
		
		//Sort the trackers and send them back
		payload.trackers.sort(Tracker.sortByConnections);
		socket.sockets.json.send(payload);
	});
	
	client.on('disconnect', function() {
        //TODO monitor this for potential future performance issues when dealing with large amounts of traffic
		for(var i = 0; i < payload.trackers.length; i++) {
            //Loop through all the trackers and then all of the sessId objects to find the right client id
            for(var c = 0; c < payload.trackers[i].clients.length; c++) {
                if(payload.trackers[i].clients[c].id == client.id) {
                    var killedTracker = payload.trackers[i];
                    payload.totalConnections--;
                    killedTracker.numConnections--;
                    payload.browsers.count[killedTracker.clients[c].browser]--;
                    //Get the string value of the user's screen resolution
                    var screenResolution = killedTracker.clients[c].getScreenResolution();
                    //Decrement the count in the payload for the appropriate resolution
                    payload.screenResolutions[screenResolution]--;
                    //Remove the user object from the array
                    killedTracker.clients.splice(c, 1);
                }
            }
		}
		
		//Sort the trackers and send them back
		payload.trackers.sort(Tracker.sortByConnections);
		socket.sockets.json.send(payload);
	});
	
});
