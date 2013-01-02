# Demo
A rough demo can be viewed [here](http://aaronjwood.dyndns.org:9001/). Keep in mind that this program is still in the very early stages.

# Tracking Code

	<script type="text/javascript" src="<PATH TO SOCKET.IO.JS>"></script>
	<script type="text/javascript">
		var screenWidth = screen.width;
		var screenHeight = screen.height;
		var os = navigator.appVersion;
		var tracker = {
			"screenWidth": screenWidth,
			"screenHeight": screenHeight,
			"os": os
		};
		var socket = io.connect("http://aaronjwood.dyndns.org:9000");
		socket.on('connect', function() {
			socket.emit("beacon", tracker);
		});
	</script>

