(function (jsOMS, undefined)
{
    jsOMS.Chart.ColumnChart = function (id)
    {
        this.chart = new jsOMS.Chart(id);

        // Setting default chart values
        this.chart.margin = {top: 5, right: 0, bottom: 0, left: 0};
        this.chart.color  = d3.scale.category10();
        this.chart.axis   = {
            x: {
                visible: true,
                label: {
                    visible: true,
                    text: 'X-Axis',
                    position: "center",
                    anchor: 'middle'
                },
                tick: {
                    prefix: '',
                    orientation: 'bottom',
                    size: 7
                },
                min: 0,
                max: 0
            },
            y: {
                visible: true,
                label: {
                    visible: true,
                    text: 'Y-Axis',
                    position: 'center',
                    anchor: 'middle'
                },
                tick: {
                    prefix: '',
                    orientation: 'bottom',
                    size: 7
                },
                min: 0,
                max: 0
            }
        };

        this.chart.grid = {
            x: {
                visible: false
            },
            y: {
                visible: true
            }
        };

        this.chart.dataSettings.marker.visible = false;
        this.chart.subtype                     = 'stacked';
    };

    jsOMS.Chart.ColumnChart.prototype.getChart = function ()
    {
        return this.chart;
    };

    jsOMS.Chart.ColumnChart.prototype.draw = function ()
    {
        let rect, svg, x, xAxis1, xAxis2, y, yAxis1, yAxis2, xGrid, yGrid, zoom, self = this, box = this.chart.chartSelect.node().getBoundingClientRect();

        if (this.chart.subtype === 'grouped') {
            this.chart.axis.y.max = d3.max(this.chart.dataset, function (layer)
            {
                return d3.max(layer.points, function (d)
                {
                    return d.y;
                });
            });
        } else {
            this.chart.axis.y.max = d3.max(this.chart.dataset, function (layer)
            {
                return d3.max(layer.points, function (d)
                {
                    return d.y0 + d.y;
                });
            });
        }

        this.chart.dimension = {
            width: box.width,
            height: box.height
        };

        x = d3.scale.ordinal().range([
            0,
            this.chart.dimension.width
            - this.chart.margin.right
            - this.chart.margin.left
        ]);

        y = d3.scale.linear().range([
            this.chart.dimension.height
            - this.chart.margin.top
            - this.chart.margin.bottom,
            10
        ]);

        // axis
        xAxis1 = d3.svg.axis().scale(x).tickFormat(function (d)
        {
            return self.chart.axis.x.tick.prefix + d;
        }).orient("bottom").outerTickSize(this.chart.axis.x.tick.size).innerTickSize(this.chart.axis.x.tick.size).tickPadding(7);

        yAxis1 = d3.svg.axis().scale(y).tickFormat(function (d)
        {
            return self.chart.axis.y.tick.prefix + d;
        }).orient("left").outerTickSize(this.chart.axis.y.tick.size).innerTickSize(this.chart.axis.y.tick.size).tickPadding(7);

        xGrid = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            //.ticks(0)
            .tickSize(
                -(this.chart.dimension.height
                - this.chart.margin.top - 10
                - this.chart.margin.bottom), 0, 0)
            .tickFormat("");

        yGrid = d3.svg.axis()
            .scale(y)
            .orient("left")
            //.ticks(0)
            .tickSize(
                -this.chart.dimension.width
                + this.chart.margin.right
                + this.chart.margin.left, 0, 0)
            .tickFormat("");

        x.domain(d3.range(this.chart.dataset[0].points.length)).rangeRoundBands([0, this.chart.dimension.width - this.chart.margin.right - this.chart.margin.left], .1);
        y.domain([0, this.chart.axis.y.max + 1]);

        svg = this.chart.chartSelect.append("svg")
            .attr("width", this.chart.dimension.width)
            .attr("height", this.chart.dimension.height)
            .append("g").attr("transform", "translate("
                + (this.chart.margin.left) + ","
                + (this.chart.margin.top) + ")");

        this.chart.drawGrid(svg, xGrid, yGrid);

        let dataPoint, dataPointEnter,
            temp       = this.drawData(svg, x, y, dataPointEnter, dataPoint);
        dataPointEnter = temp[0];
        dataPoint      = temp[1];
        this.chart.drawMarker(svg, x, y, dataPointEnter, dataPoint);
        this.chart.drawLegend(svg, dataPointEnter, dataPoint);
        this.chart.drawText(svg);
        this.chart.drawAxis(svg, xAxis1, yAxis1);

        if (this.chart.shouldRedraw) {
            this.redraw();
        }
    };

    jsOMS.Chart.ColumnChart.prototype.redraw = function ()
    {
        this.chart.shouldRedraw = false;
        this.chart.chartSelect.select("*").remove();
        this.draw();
    };

    jsOMS.Chart.ColumnChart.prototype.drawData = function (svg, x, y, dataPointEnter, dataPoint)
    {
        let self = this, rect;

        dataPoint = svg.selectAll(".dataPoint").data(this.chart.dataset, function (c)
        {
            return c.id;
        });

        dataPointEnter = dataPoint.enter().append("g").attr("class", "dataPoint")
            .style("fill", function (d)
            {
                return self.chart.color(d.name);
            });

        rect = dataPointEnter.selectAll("rect")
            .data(function (d)
            {
                return d.points;
            })
            .enter().append("rect")
            .attr("x", function (d)
            {
                return x(d.x);
            })
            .attr("y", this.chart.dimension.height - this.chart.margin.top - this.chart.margin.bottom)
            .attr("width", x.rangeBand())
            .attr("height", 0);

        if(this.chart.subtype === 'stacked') {
            rect.transition()
                .delay(function (d, i)
                {
                    return i * 10;
                })
                .attr("y", function (d)
                {
                    return y(d.y0 + d.y);
                })
                .attr("height", function (d)
                {
                    return y(d.y0) - y(d.y0 + d.y);
                });
        } else {
            rect.transition()
                .duration(500)
                .delay(function (d, i)
                {
                    return i * 10;
                })
                .attr("x", function (d, i, j)
                {
                    return x(d.x) + x.rangeBand() / self.chart.dataset.length * j;
                })
                .attr("width", x.rangeBand() /self.chart.dataset.length)
                .transition()
                .attr("y", function (d)
                {
                    return y(d.y);
                })
                .attr("height", function (d)
                {
                    return self.chart.dimension.height - self.chart.margin.top - self.chart.margin.bottom - y(d.y);
                });
        }

        return [dataPointEnter, dataPoint];
    };

    jsOMS.Chart.ColumnChart.prototype.transitionGrouped = function (x, y, rect, yMin, yMax)
    {
        y.domain([yMin, yMax]);

        rect.transition()
            .duration(500)
            .delay(function (d, i)
            {
                return i * 10;
            })
            .attr("x", function (d, i, j)
            {
                return x(d.x) + x.rangeBand() / n * j;
            })
            .attr("width", x.rangeBand() / n)
            .transition()
            .attr("y", function (d)
            {
                return y(d.y);
            })
            .attr("height", function (d)
            {
                return self.chart.dimension.height - self.chart.margin.top - self.chart.margin.bottom - y(d.y);
            });
    };

    jsOMS.Chart.ColumnChart.prototype.transitionStacked = function (x, y, rect, yMin, yMax)
    {
        y.domain([yMin, yMax]);

        rect.transition()
            .duration(500)
            .delay(function (d, i)
            {
                return i * 10;
            })
            .attr("y", function (d)
            {
                return y(d.y0 + d.y);
            })
            .attr("height", function (d)
            {
                return y(d.y0) - y(d.y0 + d.y);
            })
            .transition()
            .attr("x", function (d)
            {
                return x(d.x);
            })
            .attr("width", x.rangeBand());
    };
}(window.jsOMS = window.jsOMS || {}));

var chart;

var n      = 3, // number of layers
    m      = 30, // number of samples per layer
    stack  = d3.layout.stack(),
    layers = stack(d3.range(n).map(function ()
    {
        return bumpLayer(m, .1);
    }));

function bumpLayer(n, o)
{
    function bump(a)
    {
        var x = 1 / (.1 + Math.random()),
            y = 2 * Math.random() - .5,
            z = 10 / (.1 + Math.random());

        for (var i = 0; i < n; i++) {
            var w = (i / n - y) * z;
            a[i] += x * Math.exp(-w * w);
        }
    }

    var a = [], i;
    for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
    for (i = 0; i < 5; ++i) bump(a);
    return a.map(function (d, i)
    {
        return {x: i, y: Math.max(0, d)};
    });
}

for (let i = 0; i < layers.length; i++) {
    layers[i] = {
        id: i,
        name: 'Dataset ' + i,
        points: layers[i]
    };
}

var mychart = new jsOMS.Chart.ColumnChart('chart');
mychart.getChart().setData(layers);
mychart.draw();
