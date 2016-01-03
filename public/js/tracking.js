(function () {
    var script = document.createElement("script");
    script.src = "//localhost:3000/socket.io/socket.io.js";
    script.async = true;
    script.onreadystatechange = script.onload = function () {
        var state = script.readyState;
        if (!state || /loaded|complete/.test(state)) {
            var tracker = {
                url: document.URL,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height
            };
            var socket = io("//localhost:3000/client");
            socket.on("connect", function () {
                socket.emit("beacon", tracker);
            });
        }
    };
    document.getElementsByTagName("head")[0].appendChild(script);
}());
