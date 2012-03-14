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

//Browsers
var browsers = {
    count: {
        "Chrome": 0,
        "Firefox": 0,
        "Safari": 0,
        "Opera": 0,
        "Internet Explorer": 0
    }
}

//Tracker objects
var trackers = [];

socket.sockets.on('connection', function(client) {
	//Immediately send data upon connection
	socket.sockets.json.send(trackers.slice(0, config.totalTrackers));
	socket.sockets.send(totalConnections);
	
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
				newTracker.sessId.push(client.id);
			}
		}
		
		//Otherwise, create a new object and set the appropriate values
		if(!exists) {
			trackers.push(new tracker.track(client.id, trackingData.url, method.getBrowser(trackingData.browser), 1));
			browsers.count[method.getBrowser(trackingData.browser)]++;
		}
		
		//Sort the trackers and send them back
		trackers.sort(tracker.sort);
		socket.sockets.json.send(trackers.slice(0, config.totalTrackers));
		socket.sockets.send(totalConnections);
	});
	
	client.on('disconnect', function() {
		for(var i = 0; i < trackers.length; i++) {
			if(trackers[i].sessId.indexOf(client.id) != -1) {
				var killedTracker = trackers[i];
				totalConnections--;
				killedTracker.connections--;
				browsers.count[killedTracker.browser]--;
				killedTracker.sessId.splice(trackers[i].sessId.indexOf(client.id), 1);
			}
		}
		
		//Sort the trackers and send them back
		trackers.sort(tracker.sort);
		socket.sockets.json.send(trackers.slice(0, config.totalTrackers));
		socket.sockets.send(totalConnections);
	});
	
});
