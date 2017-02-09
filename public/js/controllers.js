"use strict";

var module = angular.module("dashboard");

module.controller("SectionsController", function ($scope, page) {
    $scope.page = page;
    $scope.page.setPage("pages");
});

module.controller("GlobalStatsController", function ($scope, socket) {
    $scope.totalConnections = 0;

    socket.on("message", function (payload) {
        $scope.totalConnections = payload.totalConnections;
    });
});

module.controller("ContentController", function ($scope, page) {
    $scope.page = page;
});

module.controller("PagesController", function ($scope, socket) {
    $scope.options = {
        cutoutPercentage: 40
    };

    socket.on("message", function (payload) {
        $scope.labels = Object.keys(payload.urls);
        $scope.data = Object.values(payload.urls);
    });
});

module.controller("BrowsersController", function ($scope, socket) {
    $scope.options = {
        cutoutPercentage: 40
    }

    socket.on("message", function (payload) {
        $scope.labels = Object.keys(payload.browsers);
        $scope.data = Object.values(payload.browsers);
    });

});
