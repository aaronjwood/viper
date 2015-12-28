"use strict";

var module = angular.module("dashboard");

module.controller("SectionsController", function ($scope, page) {
    $scope.page = page;
    $scope.page.setPage("pages");
});

module.controller("ContentController", function ($scope, page) {
    $scope.page = page;
});

module.controller("PagesController", function ($scope, socket) {
    $scope.options = {
        responsive: true,
        animation: false,
        percentageInnerCutout: 70
    };
    $scope.labels = [];
    $scope.data = [];

    socket.on("message", function (payload) {
        var labels = [];
        var data = [];

        for (var i = 0; i < payload.trackers.length; i++) {
            labels.push(payload.trackers[i].url);
            data.push(payload.trackers[i].numConnections);
        }

        $scope.labels = labels;
        $scope.data = data;
    });
});
