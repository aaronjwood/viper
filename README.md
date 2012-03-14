# Tracking Code

	<script type="text/javascript" src="<PATH TO SOCKET.IO.JS>"></script>
	<script type="text/javascript">
		var socket = io.connect("<LISTENING SERVER>");
		var tracker = {"url":window.location.href,"browser":window.navigator.userAgent};
		socket.on('connect', function() {
			socket.send(JSON.stringify(tracker));
		});
	</script>
