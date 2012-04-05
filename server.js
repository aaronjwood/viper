var http = require('http');
var io = require('socket.io');
var client = require('node-static');
var config = require('./sys/config.js');
var method = require('./sys/functions.js');
var tracker = require('./js/tracker');

//Static server to serve the dashboard
var file = new(client.Server)('./public/');
var viewServer = http.createServer(function(req, res) {
	req.addListener('end', function() {
		file.serve(req, res);
	});
});
viewServer.listen(config.port);

var socket = io.listen(viewServer);

//Total connections from all of the pages the tracking code resides on
var totalConnections = 0;

//Browser types
var browsers = {
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
}

//Tracker objects
var trackers = [];

socket.sockets.on('connection', function(client) {
	//Immediately send data upon connection
	socket.sockets.json.send(trackers.slice(0, config.totalTrackers));
	socket.sockets.send(totalConnections);
    socket.sockets.json.send(browsers);
	
	client.on('message', function(msg) {
		totalConnections++;
		var trackingData = JSON.parse(msg);
		var exists = false;
		for(var i = 0; i < trackers.length; i++) {
			var newTracker = trackers[i];
			//If an object already exists with the same URL, don't create a new one!
			if(newTracker.url == trackingData.url) {
				exists = true;
				newTracker.connections++;
				browsers.count[method.getBrowser(trackingData.browser)]++;
				//We need the client's session id to accurately increment or decrement the number of connections to a given URL
                var newUser = new tracker.user(client.id, method.getBrowser(trackingData.browser));
				newTracker.sessId.push(newUser);
			}
		}
		
		//Otherwise, create a new user/tracker, set the appropriate values, and increment the browser count
		if(!exists) {
            var newUser = new tracker.user(client.id, method.getBrowser(trackingData.browser));
            var newTracker = new tracker.track(newUser, trackingData.url, 1);
			trackers.push(newTracker);
			browsers.count[method.getBrowser(trackingData.browser)]++;
		}
		
		//Sort the trackers and send them back
		trackers.sort(tracker.sort);
		socket.sockets.json.send(trackers.slice(0, config.totalTrackers));
		socket.sockets.send(totalConnections);
        socket.sockets.json.send(browsers);
	});
	
	client.on('disconnect', function() {
        //TODO analyze this for performance issues in the future
		for(var i = 0; i < trackers.length; i++) {
            //Loop through all the trackers and then all of the sessId objects to find the right client id
            for(var c = 0; c < trackers[i].sessId.length; c++) {
                if(trackers[i].sessId[c].id == client.id) {
                    var killedTracker = trackers[i];
        			totalConnections--;
    				killedTracker.connections--;
    				browsers.count[killedTracker.sessId[c].browser]--;
                    //Remove the user object from the array
    				killedTracker.sessId.splice(c, 1);
                }
            }
		}
		
		//Sort the trackers and send them back
		trackers.sort(tracker.sort);
		socket.sockets.json.send(trackers.slice(0, config.totalTrackers));
		socket.sockets.send(totalConnections);
        socket.sockets.json.send(browsers);
	});
	
});
