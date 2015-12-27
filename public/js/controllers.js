"use strict";

var module = angular.module("dashboard");

module.controller("SectionsController", function ($scope, page) {
    $scope.page = page;
    $scope.page.setPage("pages");
});

module.controller("ContentController", function ($scope, page) {
    $scope.page = page;
});

module.controller("PagesController", function ($scope) {

});
