"use strict";

var module = angular.module("dashboard");
module.service("page", function () {
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