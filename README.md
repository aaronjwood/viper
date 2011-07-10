# Tracking Code

	<script type="text/javascript" src="http://aaronjwood.com:9000/socket.io/socket.io.js"></script>
	<script type="text/javascript">
		var socket = io.connect("aaronjwood.com:9000");
		var tracker = {"url":window.location.href,"browser":window.navigator.userAgent};
		socket.on('connect', function() {
			socket.send(JSON.stringify(tracker));
		});
	</script>