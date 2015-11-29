(function (jsOMS, undefined) {
    jsOMS.LineChart = function () {
        this.chart = new jsOMS.Chart();
        this.xIsDate = false;
        this.yIsDate = false;
    };

    jsOMS.LineChart.prototype.setXDate = function(date) {
        this.xIsDate = date;
    };

    jsOMS.LineChart.prototype.setYDate = function(date) {
        this.yIsDate = date;
    };

    jsOMS.LineChart.prototype.draw = function() {
        var x, y;

        if(this.xIsDate) {
            x = d3.time.scale().range([0, this.chart.getDimension().width]);
        } else {
            x = d3.scale.linear().range([0, this.chart.getDimension().width]);
        }

        if(this.yIsDate) {
            y = d3.time.scale().range([this.chart.getDimension().height, 0]);
        } else {
            y = d3.scale.linear().range([this.chart.getDimension().height, 0]);
        }
    }
}(window.jsOMS = window.jsOMS || {}));
