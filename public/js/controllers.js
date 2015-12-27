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
    $scope.labels = [];
    $scope.data = [];

    socket.on("message", function (payload) {
        for (var i = 0; i < payload.trackers.length; i++) {
            var idx = $scope.labels.indexOf(payload.trackers[i].url);
            if (idx === -1) {
                $scope.labels.push(payload.trackers[i].url);
                $scope.data.push(payload.trackers[i].numConnections);
            }
            else {
                $scope.data[idx] = payload.trackers[i].numConnections
            }
        }
    });
});
