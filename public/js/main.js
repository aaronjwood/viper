google.load('visualization', '1.0', {'packages': ['corechart'], 'callback': function() {
    $(function() {
        $("#showQuickStats").on("click", function() {
            var quickStats = $("#quickStats");
            if(parseInt(quickStats.css("top")) != 0) {
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

        var locationsMap = L.map("locationsMap", {
            center: new L.LatLng(0, 0),
            worldCopyJump: true,
            zoom: 1
        });
        L.tileLayer("http://{s}.tiles.mapbox.com/v3/aaronjwood.ifnf1d22/{z}/{x}/{y}.png", {
            maxZoom: 18
        }).addTo(locationsMap);

        var socket = io();
        var pages = $("#pages");
        var totalConnections = $("#totalConnections");
        var mostPopularBrowser = $("#mostPopularBrowser");
        var screenResContainer = $("#resolutions");
        var osContainer = $("#os");
        var browserCharts = new BrowserCharts();
        socket.on('message', function(payload) {
            totalConnections.html(payload.totalConnections);

            browserCharts.updateData(payload.browsers.count);

            var trackingData = "";

            //Get the URL and number of connections for each tracker
            for(var i = 0; i < payload.trackers.length; i++) {
                trackingData += "<div><a href='" + payload.trackers[i].url + "'>" + payload.trackers[i].url + " - <strong>" + payload.trackers[i].numConnections + "</strong></div>";
            }
            pages.html(trackingData);

            var resolutions = [];
            var resolutionData = "";
            for(var resolution in payload.screenResolutions) {
                resolutions.push({
                    resolution: resolution,
                    count: payload.screenResolutions[resolution]
                });
            }

            resolutions.sort(function(a, b) {
                return b.count - a.count;
            });

            for(var i = 0; i < resolutions.length; i++) {
                resolutionData += "<div>" + resolutions[i].resolution + " - " + resolutions[i].count + "</div>";
            }
            screenResContainer.html(resolutionData);

            var oses = [];
            var osData = "";
            for(var os in payload.os) {
                oses.push({
                    os: os,
                    count: payload.os[os]
                });
            }

            oses.sort(function(a, b) {
                return b.count - a.count;
            });

            for(var i = 0; i < oses.length; i++) {
                osData += "<div>" + oses[i].os + " - " + oses[i].count + "</div>";
            }
            osContainer.html(osData);
        });
    });
}});
 