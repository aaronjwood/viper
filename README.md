# Demo
	A rough demo of this application can be viewed <a href="http://aaronjwood.com:9000/">here.</a>

# Tracking Code

	<script type="text/javascript" src="<PATH TO SOCKET.IO.JS>"></script>
	<script type="text/javascript">
		var url = window.location.href;
		var browser = window.navigator.userAgent;
		var screenWidth = screen.width;
		var screenHeight = screen.height;
		var os = navigator.appVersion;
		var tracker = {
			"url": url,
			"browser": browser,
			"screenWidth": screenWidth,
			"screenHeight": screenHeight,
			"os": os
		};
		var socket = io.connect("http://aaronjwood.com:9000");
		socket.on('connect', function() {
			socket.send(JSON.stringify(tracker));
		});
	</script>

