# Tracking Code

	<script type="text/javascript" src="<PATH TO SOCKET.IO.JS>"></script>
	<script type="text/javascript">
		var url = window.location.href;
		var browser = window.navigator.userAgent;
		var screenWidth = screen.width;
		var screenHeight = screen.height;
		var tracker = {
			"url": url,
			"browser": browser,
			"screenWidth": screenWidth,
			"screenHeight": screenHeight
		};
	    var socket = io.connect("<LISTENING SERVER>");
	    socket.on('connect', function() {
	        socket.send(JSON.stringify(tracker));
	    });
	</script>

