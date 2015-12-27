"use strict";

angular.module("dashboard", ["chart.js"]).config(function(ChartJsProvider) {
    ChartJsProvider.setOptions({
        responsive: true
    });
});
