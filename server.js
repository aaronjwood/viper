var http = require('http');
var io = require('socket.io');
var static = require('node-static');

var file = new(static.Server)('./public/');
var viewServer = http.createServer(function(req, res) {
	req.addListener('end', function() {
		file.serve(req, res);
	});
});
viewServer.listen(9000);
var viewSocket = io.listen(viewServer);

//Total connections
var totalConnections = 0;

var trackers = [];

var topTrackers = [];

function pageTracker(sessId, url, connections) {
	this.sessId = [];
	this.sessId.push(sessId);
	this.url = url;
	this.connections = connections;
}

function sortTracking(pageTracker1, pageTracker2) {
	return pageTracker2.connections - pageTracker1.connections;
}

viewSocket.on('connection', function(client) {
	client.on('message', function(msg) {
		totalConnections++;
		var exists = false;
		for(var i = 0; i < trackers.length; i++) {
			if(trackers[i].url == msg) {
				exists = true;
				trackers[i].connections++;
				trackers[i].sessId.push(client.sessionId);
			}
		}
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
		topTrackers.sort(sortTracking);
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

