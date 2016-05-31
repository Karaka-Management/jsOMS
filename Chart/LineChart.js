(function (jsOMS)
{
    jsOMS.Chart.LineChart = function (id)
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
                visible: true
            },
            y: {
                visible: true
            }
        };

        this.chart.subtype = 'line';
    };

    jsOMS.Chart.LineChart.prototype.getChart = function ()
    {
        return this.chart;
    };

    jsOMS.Chart.LineChart.prototype.draw = function ()
    {
        let line, svg, x, xAxis1, xAxis2, y, yAxis1, yAxis2, xGrid, yGrid, zoom, self = this, box = this.chart.chartSelect.node().getBoundingClientRect();

        this.chart.dimension = {
            width: box.width,
            height: box.height
        };

        // todo: allow ordinal data axis
        x = d3.scale.linear().range([
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
        // todo: implement manual tick (e.g. .ticks(6)) setting for axis
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

        x.domain([this.chart.axis.x.min, this.chart.axis.x.max + 1]);
        y.domain([this.chart.axis.y.min - 1, this.chart.axis.y.max + 1]);

        if (this.chart.subtype === 'area') {
            line = d3.svg.area().interpolate(this.chart.dataSettings.interpolate).x(function (d)
            {
                return x(d.x);
            }).y0(this.chart.getDimension().height).y1(function (d)
            {
                return y(d.y);
            });
        } else if (this.chart.subtype === 'stacked') {
            line = d3.svg.area().interpolate(this.chart.dataSettings.interpolate).x(function (d)
            {
                return x(d.x);
            }).y0(function (d)
            {
                return y(d.y0);
            }).y1(function (d)
            {
                return y(d.y + d.y0);
            });
        } else if (this.chart.subtype === 'line') {
            line = d3.svg.line().interpolate(this.chart.dataSettings.interpolate).x(function (d)
            {
                return x(d.x);
            }).y(function (d)
            {
                return y(d.y);
            });
        }

        zoom = d3.behavior.zoom().x(x).scaleExtent([1, 2]).on('zoom', function ()
        {
            let tx, ty;
            tx = d3.event.translate[0];
            ty = d3.event.translate[1];
            tx = Math.min(1,
                Math.max(tx,
                    self.chart.dimension.width
                    - self.chart.margin.right
                    - self.chart.margin.left
                    - Math.round(x(self.chart.axis.y.max) - x(1)),
                    self.chart.dimension.width
                    - self.chart.margin.right
                    - self.chart.margin.left
                    - Math.round(x(self.chart.axis.y.max) - x(1)) * d3.event.scale));

            zoom.translate([tx, ty]);
            svg.select('.x.axis').call(xAxis1);
            svg.select('.x.grid').call(xGrid);
            svg.selectAll('.line').attr("d", function (d)
            {
                return line(d.points);
            }).style("stroke", function (d)
            {
                return self.chart.color(d.name);
            });

            if (self.chart.subtype === 'stacked') {
                return svg.selectAll('circle.dot').attr('cy', function (d)
                {
                    return y(d.y + d.y0);
                }).attr('cx', function (d)
                {
                    return x(d.x);
                }).attr('r', 4);
            } else {
                return svg.selectAll('circle.dot').attr('cy', function (d)
                {
                    return y(d.y);
                }).attr('cx', function (d)
                {
                    return x(d.x);
                }).attr('r', 4);
            }
        });

        svg = this.chart.chartSelect.append("svg")
            .attr("width", this.chart.dimension.width)
            .attr("height", this.chart.dimension.height)
            .append("g").attr("transform", "translate("
                + (this.chart.margin.left) + ","
                + (this.chart.margin.top) + ")");

        this.chart.drawGrid(svg, xGrid, yGrid);
        this.drawZoomPanel(svg, zoom);

        zoom.scaleExtent([1, Number.MAX_VALUE]);
        //svg.selectAll('.x.grid').transition().duration(500).call(xGrid);
        //svg.selectAll('.x.axis').transition().duration(500).call(xAxis1);
        //svg.selectAll('.y.axis').transition().duration(500).call(yAxis1);

        let dataPoint, dataPointEnter,
            temp       = this.drawData(svg, line, dataPointEnter, dataPoint);
        dataPointEnter = temp[0];
        dataPoint      = temp[1];
        this.chart.drawMarker(svg, x, y, dataPointEnter, dataPoint);
        this.chart.drawLegend(svg, dataPointEnter, dataPoint);
        this.chart.drawText(svg);
        this.chart.drawAxis(svg, xAxis1, yAxis1);

        if (this.chart.shouldRedraw) {
            this.redraw();
        }

        return zoom.x(x);
    };

    jsOMS.Chart.LineChart.prototype.redraw = function ()
    {
        this.chart.shouldRedraw = false;
        this.chart.chartSelect.select("*").remove();
        this.draw();
    };

    jsOMS.Chart.LineChart.prototype.drawData = function (svg, line, dataPointEnter, dataPoint)
    {
        let self = this;

        dataPoint = svg.selectAll(".dataPoint").data(this.chart.dataset, function (c)
        {
            return c.id;
        });

        dataPointEnter = dataPoint.enter().append("g").attr("class", "dataPoint");
        dataPointEnter.append("path").attr('clip-path', 'url(#clipper1)').attr("class", self.chart.subtype);
        dataPoint.select('path').style("stroke-width", this.chart.dataSettings.style.strokewidth).transition().duration(500).attr("d", function (d)
        {
            return line(d.points);
        }).style("stroke", function (d)
        {
            return self.chart.color(d.name);
        }).style("fill", function (d)
        {
            if (self.chart.subtype === 'area' || self.chart.subtype === 'stacked') {
                return self.chart.color(d.name);
            }
        });

        return [dataPointEnter, dataPoint];
    };

    jsOMS.Chart.LineChart.prototype.drawZoomPanel = function (svg, zoom)
    {
        this.chart.position.zoompanel.top = 10;

        svg.append("rect")
            .attr('class', 'zoom-panel')
            .attr('y', this.chart.position.zoompanel.top)
            .attr("width",
                this.chart.dimension.width
                - this.chart.margin.right
                - this.chart.margin.left
            )
            .attr("height",
                this.chart.dimension.height
                - this.chart.margin.top
                - this.chart.margin.bottom - this.chart.position.zoompanel.top
            ).call(zoom);
    };
}(window.jsOMS = window.jsOMS || {}));

var c, chart, data, dataGen, i, k, count;

dataGen = (function ()
{
    return (function (id)
    {
        return function ()
        {
            var tempData, j, nums, y1Seed;
            nums     = Math.ceil(Math.random() * 50) + 4;
            y1Seed   = Math.round(Math.random() * 20);
            tempData = {
                id: id,
                name: "Dataset " + id,
                points: (function ()
                {
                    var k, ref, results, prev, counter = 0;
                    results                            = [];
                    for (j = k = 1, ref = nums; 1 <= ref ? k <= ref : k >= ref; j = 1 <= ref ? ++k : --k) {
                        if (data.length > 0) {
                            if (typeof data[count - 2].points !== 'undefined' && data[count - 2].points.length > counter && typeof data[count - 2].points[counter].y !== 'undefined') {
                                prev = data[count - 2].points[counter].y;
                            } else {
                                prev = 0;
                            }
                        } else {
                            prev = 0;
                        }

                        counter++;

                        results.push({
                            x: j,
                            y: y1Seed + Math.round(Math.random() * 5),
                            y0: prev
                        });
                    }

                    return results;
                })()
            };
            id       = id + 1;
            return tempData;
        };
    })(1);
})();

data = [];

for (i = k = 1; k <= 3; i = ++k) {
    count = i;
    data.push(dataGen());
}
/*
var mychart = new jsOMS.Chart.LineChart('chart');
mychart.getChart().setData(data);
mychart.draw();
*/