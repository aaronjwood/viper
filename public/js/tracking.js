var script = document.createElement("script");
script.src = "//localhost:3000/socket.io/socket.io.js";
document.getElementsByTagName("head")[0].appendChild(script);
var tracker = {
    url: document.URL,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height
};
var socket = io.connect("//localhost:3000/socket.io/socket.io.js");
socket.on('connect', function() {
    socket.emit("beacon", tracker);
});