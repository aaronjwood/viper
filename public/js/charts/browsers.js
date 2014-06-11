var BrowserCharts = function() {
    this.data;
    this.options;
    this.chart;
    this.draw();
};

BrowserCharts.prototype.draw = function() {
    this.data = new google.visualization.arrayToDataTable([
        ['Browser', 'Connections', {role: 'style'}],
        ['Chrome', 0, '#4cb848'],
        ['Opera', 0, '#c70f17'],
        ['Internet Explorer', 0, '#00acee'],
        ['Firefox', 0, '#f96400'],
        ['Safari', 0, '#1e5b9c'],
        ['iPad', 0, '#717171'],
        ['Android', 0, '#8dd215'],
        ['iPhone', 0, '#343d46'],
        ['Other', 0, '#871F78']
    ]);

    this.options = {
        'title': 'Browsers',
        'width': 1100,
        'height': 550,
        animation: {
            duration: 500,
            easing: 'inAndOut'
        },
        'backgroundColor': 'transparent',
        'legend': {
            'position': 'none'
        }
    };

    this.chart = new google.visualization.ColumnChart(document.getElementById("browsers"));
    this.chart.draw(this.data, this.options);
};

BrowserCharts.prototype.updateData = function(vals) {
    this.data.setValue(0, 1, vals.Chrome);
    this.data.setValue(1, 1, vals.Opera);
    this.data.setValue(2, 1, vals.IE);
    this.data.setValue(3, 1, vals.Firefox);
    this.data.setValue(4, 1, vals.Safari);
    this.data.setValue(5, 1, vals.iPad);
    this.data.setValue(6, 1, vals.Android);
    this.data.setValue(7, 1, vals.iPhone);
    this.data.setValue(8, 1, vals.Other);
    this.chart.draw(this.data, this.options);
};
