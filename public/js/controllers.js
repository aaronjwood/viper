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

        for (var url in payload.urls) {
            if (payload.urls.hasOwnProperty(url)) {
                labels.push(url);
                data.push(payload.urls[url]);
            }
        }

        $scope.labels = labels;
        $scope.data = data;
    });
});
