var http = require('http');
var io = require('socket.io');
var static = require('node-static');
var tracker = require('./js/tracker');
var config = require('./config/config.js');

//Static server to serve the dashboard
var file = new(static.Server)('./public/');
var viewServer = http.createServer(function(req, res) {
	req.addListener('end', function() {
		file.serve(req, res);
	});
});
viewServer.listen(config.set.port);

var socket = io.listen(viewServer);

//Total visitors/connections from all the pages the tracking code resides on
var totalConnections = 0;

//Tracker objects
var trackers = [];

//Array to hold the top 10 tracker objects
//TODO Maybe get rid of this and just send back the top 10 trackers from the trackers array? Possibly unnecessary overhead by using two arrays filled with objects...
var topTrackers = [];

socket.sockets.on('connection', function(client) {
	
	//Immediately send data upon connection
	socket.sockets.json.send(trackers.slice(0, 10));
	socket.sockets.send(totalConnections);
	
	client.on('message', function(msg) {
		totalConnections++;
		var trackingData = JSON.parse(msg);
		var exists = false;
		
		for(var i = 0; i < trackers.length; i++) {
			
			//If an object already exists with the same URL, don't create a new one!
			if(trackers[i].url == trackingData.url) {
				exists = true;
				trackers[i].connections++;
				
				//We need the client's session id to accurately increment or decrement the number of connections to a given URL
				trackers[i].sessId.push(client.id);
			}
		}
		
		//Otherwise, create a new object and set the appropriate values
		if(!exists) {
			trackers.push(new tracker.track(client.id, trackingData.url, 1));
		}
		
		//Sort the trackers before we send them back to the client
		trackers.sort(tracker.sort);
		
		//Send the top 10 trackers and the total connection count
		socket.sockets.json.send(trackers.slice(0, 10));
		socket.sockets.send(totalConnections);
	});
	
	client.on('disconnect', function() {
		for(var i = 0; i < trackers.length; i++) {
			if(trackers[i].sessId.indexOf(client.id) != -1) {
				totalConnections--;
				trackers[i].connections--;
				trackers[i].sessId.splice(trackers[i].sessId.indexOf(client.id), 1);
			}
		}
		
		//Sort the trackers before sending them back to the client
		trackers.sort(tracker.sort);
		socket.sockets.json.send(trackers.slice(0, 10));
		socket.sockets.send(totalConnections);
	});
	
});

