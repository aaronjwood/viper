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

module.service("socket", function ($rootScope) {
    var socket = io("//localhost:3000");

    return {
        on: function (event, cb) {
            socket.on(event, function () {
                var args = arguments;

                $rootScope.$apply(function () {
                    cb.apply(socket, args);
                });
            });
        },
        emit: function (event, data, cb) {
            socket.emit(event, data, function () {
                var args = arguments;

                $rootScope.$apply(function () {
                    if (cb) {
                        cb.apply(socket, args);
                    }
                });
            });
        }
    }
});
