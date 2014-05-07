var browserChart = {
    browsers: {},
    counts: {},
    bars: {},
    init: function() {
        this.browserTotal = $("#browserTotal");
        this.mostPopularBrowser = $("#mostPopularBrowser");
        this.counts.Chrome = $(".chrome .chartCount");
        this.counts.IE = $(".ie .chartCount");
        this.counts.Opera = $(".opera .chartCount");
        this.counts.Firefox = $(".firefox .chartCount");
        this.counts.Safari = $(".safari .chartCount");
        this.counts.Android = $(".android .chartCount");
        this.counts.iPad = $(".ipad .chartCount");
        this.counts.iPhone = $(".iphone .chartCount");
        this.counts.Other = $(".other .chartCount");
        this.bars.Chrome = $(".chrome");
        this.bars.IE = $(".ie");
        this.bars.Opera = $(".opera");
        this.bars.Firefox = $(".firefox");
        this.bars.Safari = $(".safari");
        this.bars.Android = $(".android");
        this.bars.iPad = $(".ipad");
        this.bars.iPhone = $(".iphone");
        this.bars.Other = $(".other");
    },
    total: function() {
        var total = 0;
        for(browser in this.browsers) {
            total += this.browsers[browser];
        }
        return total;
    },
    mostPopular: function() {
        var highestCount = 0;
        var mostPopular = "";
        for(var browser in this.browsers) {
            if(this.browsers[browser] > highestCount) {
                mostPopular = browser;
                highestCount = this.browsers[browser];
            }
        }
        return mostPopular;
    },
    height: function(browser) {
        var height = parseInt($(".chart").css("height"));
        if(this.total() == 0) {
            return -height;
        }
        var barHeight = this.browsers[browser] / this.total();
        barHeight = parseFloat(height * barHeight);
        barHeight = 550 - barHeight;
        return -barHeight;
    },
    updateChartCounts: function() {
        for(var count in this.counts) {
            this.counts[count].text(this.browsers[count]);
        }
    },
    repaint: function() {
        this.browserTotal.text(this.total());
        this.mostPopularBrowser.text(this.mostPopular());
        this.updateChartCounts();
        for(var bar in this.bars) {
            this.bars[bar].stop().animate({"bottom": this.height(bar)});
        }
    }
};