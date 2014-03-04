function changeBrowserColor(browser) {
    if (browser) {
        return $("." + browser.toLowerCase()).css("background-color");
    }
}

$(function() {

    $("#showQuickStats").on("click", function() {
        var quickStats = $("#quickStats");
        if (parseInt(quickStats.css("top")) != 0) {
            quickStats.animate({"top": 0});
        }
        else {
            quickStats.animate({"top": -85});
        }
        return false;
    });

    $(".control a").on("click", function() {
        var control = $(this).attr("class");
        control = $("#" + control);
        if(control.hasClass("activeControl")) {
            return false;
        }
        $(".activeControl:visible").fadeOut(300, function() {
            control.fadeIn(300, function() {
                locationsMap.invalidateSize();
            }).addClass("activeControl");
        }).removeClass("activeControl");
        return false;
    });

    browserChart.init();
    var locationsMap = L.map("locationsMap", {
        center: new L.LatLng(0, 0),
        worldCopyJump: true,
        zoom: 1
    });
    L.tileLayer("http://{s}.tile.cloudmade.com/1B5CF31556BA4646A5059989DA6FC03C/999/256/{z}/{x}/{y}.png", {
        maxZoom: 18
    }).addTo(locationsMap);

    var socket = io.connect();
    var pages = $("#pages");
    var totalConnections = $("#totalConnections");
    var mostPopularBrowser = $("#mostPopularBrowser");
    var screenResContainer = $("#resolutions");
    var osContainer = $("#os");

    socket.on('connect', function() {
        $("#browsers").fadeIn(300).addClass("activeControl");
    });

    socket.on('message', function(payload) {
        totalConnections.html(payload.totalConnections);

        var trackingData = "";

        //Get the URL and number of connections for each tracker
        for (var i = 0; i < payload.trackers.length; i++) {
            trackingData += "<div><a href='"+payload.trackers[i].url+"'>" + payload.trackers[i].url + " - <strong>" + payload.trackers[i].numConnections + "</strong></div>";
        }
        pages.html(trackingData);

        for (var browser in payload.browsers.count) {
            browserChart.browsers[browser] = payload.browsers.count[browser];
        }
        browserChart.repaint();

        mostPopularBrowser.css("color", changeBrowserColor(mostPopularBrowser.html()));

        var resolutions = [];
        var resolutionData = "";
        for (var resolution in payload.screenResolutions) {
            resolutions.push({
                resolution: resolution,
                count: payload.screenResolutions[resolution]
            });
        }

        resolutions.sort(function(a, b) {
            return b.count - a.count;
        });

        for (var i = 0; i < resolutions.length; i++) {
            resolutionData += "<div>" + resolutions[i].resolution + " - " + resolutions[i].count + "</div>";
        }
        screenResContainer.html(resolutionData);

        var oses = [];
        var osData = "";
        for (var os in payload.os) {
            oses.push({
                os: os,
                count: payload.os[os]
            });
        }

        oses.sort(function(a, b) {
            return b.count - a.count;
        });

        for (var i = 0; i < oses.length; i++) {
            osData += "<div>" + oses[i].os + " - " + oses[i].count + "</div>";
        }
        osContainer.html(osData);
    });

});