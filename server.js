var http = require('http');
var io = require('socket.io');
var static = require('node-static');

//Create a new static server and serve the files inside the public/ directory
var file = new(static.Server)('./public/');
var viewServer = http.createServer(function(req, res) {
	req.addListener('end', function() {
		file.serve(req, res);
	});
});
//Bind to port 9000
//TODO make the port a user-changable setting...maybe through the use of config files?
viewServer.listen(9000);
var viewSocket = io.listen(viewServer);

//Total visitors/connections from all the pages the tracking code is on
var totalConnections = 0;

//Array to hold tracker objects
var trackers = [];

//Array to hold the top 10 tracker objects
//TODO Maybe get rid of this and just send back the top 10 trackers from the trackers array? Possibly unnecessary overhead by using two arrays filled with objects...
var topTrackers = [];

//Tracker object
function pageTracker(sessId, url, connections) {
	this.sessId = [];
	this.sessId.push(sessId);
	this.url = url;
	this.connections = connections;
}

//This will return the trackers in an array in descending order
function sortTracking(pageTracker1, pageTracker2) {
	return pageTracker2.connections - pageTracker1.connections;
}

viewSocket.on('connection', function(client) {
	client.on('message', function(msg) {
		totalConnections++;
		var exists = false;
		for(var i = 0; i < trackers.length; i++) {
			//If an object already exists with the same URL, don't create a new one!
			if(trackers[i].url == msg) {
				exists = true;
				trackers[i].connections++;
				trackers[i].sessId.push(client.sessionId);
			}
		}
		//Otherwise, create a new object and set the appropriate values
		if(!exists) {
			trackers.push(new pageTracker(client.sessionId, msg, 1));
		}
		trackers.sort(sortTracking);
		for(var i = 0; i < trackers.length; i++) {
			if(i >= 10) {
				break;
			}
			topTrackers[i] = trackers[i];
		}
		//Sort the top 10 trackers in descending order before we send them to the client
		topTrackers.sort(sortTracking);
		//Send the top 10 trackers and the total connection count
		client.broadcast(JSON.stringify(topTrackers));
		client.broadcast(totalConnections);
	});
	
	client.on('disconnect', function() {
		trackers.sort(sortTracking);
		for(var i = 0; i < trackers.length; i++) {
			if(trackers[i].sessId.indexOf(client.sessionId) != -1) {
				totalConnections--;
				trackers[i].connections--;
				trackers[i].sessId.splice(trackers[i].sessId.indexOf(client.sessionId), 1);
			}
		}
		topTrackers.sort(sortTracking);
		client.broadcast(JSON.stringify(topTrackers));
		client.broadcast(totalConnections);
	});
});

