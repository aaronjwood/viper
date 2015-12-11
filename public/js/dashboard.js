"use strict";

var dashboard = angular.module("viperDashboard", []);

dashboard.service("page", function () {
    var page;

    return {
        getPage: function () {
            return page;
        },
        setPage: function (value) {
            page = value;
        }
    };
});

dashboard.controller("SectionsController", function ($scope, page) {
    $scope.page = page;
    $scope.page.setPage("pages");
});

dashboard.controller("ContentController", function ($scope, page) {
    $scope.page = page;
});
