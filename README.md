# Viper
Real-time tracking and analytics using Node.js and Socket.IO.

The purpose of this analytics program is not to track and accumulate data over time but to present various metrics of your users in real-time.

What do I mean by real-time? For browsers that support [native web sockets](http://caniuse.com/websockets) we're talking about a full-duplex TCP connection that typically has less than 100ms of latency.

The way Viper works both functionally and technically is fundamentally different from Google Analytics and its real-time component. As of 6/9/2013, Google Analytics considers a user active if they have triggered an event or pageview within the past 5 minutes. This means if someone is sitting on your page for over 5 minutes but is still actively using something, Google Analytics will consider that user inactive and remove them from the real-time count.

Since Viper's purpose is to give data on a real-time basis there is no need for tracking sessions or how long it's been since a user made a request of some sort. There is no database behind Viper. Everything is persisted inside of the server which means that all data will be lost if the server is stopped. This is one of the main reasons why Viper is so different from other similar programs.

# Tracking Code

    <script type="text/javascript" src="<URL OF SOCKET.IO.JS>"></script>
    <script type="text/javascript">
        var tracker = {
                url: document.URL,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height
        };
        var socket = io.connect("<URL OF SOCKET SERVER>");
        socket.on('connect', function() {
                socket.emit("beacon", tracker);
        });
    </script>