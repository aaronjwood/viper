"use strict";

var module = angular.module("dashboard");
dashboard.controller("SectionsController", function ($scope, page) {
    $scope.page = page;
    $scope.page.setPage("pages");
});

dashboard.controller("ContentController", function ($scope, page) {
    $scope.page = page;
});
