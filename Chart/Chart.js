(function (jsOMS, undefined)
{
    jsOMS.Chart = function (id)
    {
        this.chartId = id;
        this.chartSelect = d3.select('#' + this.chartId);

        this.title = {
            visible: true,
            text: "Title",
            anchor: "middle",
            position: "center"
        };
        this.subtitle = {
            visible: true,
            text: "This is a short subtitle",
            anchor: "middle",
            position: "center"
        };
        this.footer = {
            visible: true,
            text: "(c) Orange Management Solutions",
            anchor: "end",
            position: "right"
        };
        this.legend = {
            visible: true
        };
        this.color = d3.scale.category10();
        this.dataset = [];
        this.dataSettings = {
            style: {
                strokewidth: 3
            },
            marker: {
                visible: true
            },
            info: {
                visible: true
            },
            extremum: {
                visible: false
            },
            values: {
                visible: false
            },
            dataset: true, /* show dataset below */
            interpolate: "linear", /* splines interpolation? */
        };

        this.axis = {};
        this.grid = {};

        this.purge();
    };

    jsOMS.Chart.prototype.calculateHorizontalPosition = function (position)
    {
        var x = 0;
        if (position === 'center') {
            x = (
                    this.dimension.width
                    - this.margin.right
                    - this.margin.left
                ) / 2;
        } else if (position === 'left') {
            x = 0;
        } else if (position === 'right') {
            x = this.dimension.width - this.margin.right - this.margin.left;
        }

        return x;
    };

    jsOMS.Chart.prototype.calculateVerticalPosition = function (position)
    {
        var y = 0;
        if (position === 'center') {
            y = -(this.dimension.height
                    - this.margin.top
                    - this.margin.bottom
                ) / 2;
        } else if (position === 'bottom') {
            y = -(this.dimension.height
                - this.margin.top
                - this.margin.bottom
            );
        } else if (position === 'top') {
            y = -this.margin.top;
        }

        return y;
    };

    jsOMS.Chart.prototype.setColor = function (color)
    {
        this.color = color;
    };

    jsOMS.Chart.prototype.getColor = function ()
    {
        return this.color;
    };

    jsOMS.Chart.prototype.setAxis = function (id, axis)
    {
        this.axis[id] = axis;

        // Setting axis dimensions in case dataset existss
        if (Object.keys(this.dataset).length > 0) {
            this.axis[id].max = d3.max(this.dataset, function (m)
            {
                return d3.max(m.points, function (d)
                {
                    return d[id];
                });
            });
        }
    };

    jsOMS.Chart.prototype.setMargin = function (top, right, bottom, left)
    {
        this.margin = {top: top, right: right, bottom: bottom, left: left};
    };

    jsOMS.Chart.prototype.setDimension = function (width, height)
    {
        this.dimension = {width: width, height: height};
    };

    jsOMS.Chart.prototype.getDimension = function ()
    {
        return this.dimension;
    };

    jsOMS.Chart.prototype.setDimensionRelative = function (relative)
    {
        this.relative = relative;
    };

    jsOMS.Chart.prototype.setTitle = function (title)
    {
        this.title = title;
    };

    jsOMS.Chart.prototype.getTitle = function ()
    {
        return this.title;
    };

    jsOMS.Chart.prototype.setSubtitle = function (subtitle)
    {
        this.subtitle = subtitle;
    };

    jsOMS.Chart.prototype.getSubtitle = function ()
    {
        return this.subtitle;
    };

    jsOMS.Chart.prototype.setFooter = function (footer)
    {
        this.footer = footer;
    };

    jsOMS.Chart.prototype.getFooter = function ()
    {
        return this.footer;
    };

    jsOMS.Chart.prototype.setLegend = function (legend)
    {
        this.legend = legend;
    };

    jsOMS.Chart.prototype.getLegend = function ()
    {
        if (!this.legend) {
            this.legend = new jsOMS.ChartLegend();
        }

        return this.legend;
    };

    jsOMS.Chart.prototype.addDataset = function (dataset)
    {
        this.dataset.push(dataset);

        this.findAxisDomain();
    };

    jsOMS.Chart.prototype.setData = function (data)
    {
        this.dataset = data;

        this.findAxisDomain();
    };

    jsOMS.Chart.prototype.findAxisDomain = function ()
    {
        for (var id in this.axis) {
            this.axis[id].max = d3.max(this.dataset, function (m)
            {
                return d3.max(m.points, function (d)
                {
                    return d[id];
                });
            });

            this.axis[id].min = d3.min(this.dataset, function (d)
            {
                return d3.min(d.points, function (t)
                {
                    return t[id];
                });
            })
        }
    };

    jsOMS.Chart.prototype.getData = function ()
    {
        return this.dataset;
    };

    jsOMS.Chart.prototype.drawLegend = function (svg, dataPointEnter, dataPoint)
    {
        var self = this;

        if (this.legend !== undefined && this.legend.visible) {
            dataPointEnter.append("text").attr('class', 'dataPoint-name');
            dataPoint.select("text.dataPoint-name").attr("x",
                this.dimension.width
                - this.margin.right
                - this.margin.left + 20
            ).attr("y", function (d, i)
            {
                return i * 20 + 10 - 1;
            }).attr("dy", ".35em").text(function (d)
            {
                return d.name;
            });
            dataPointEnter.append('circle').attr('class', 'dataPoint-dot');
            dataPoint.select('circle.dataPoint-dot').attr('cx',
                this.dimension.width
                - this.margin.right
                - this.margin.left + 10
            ).attr('cy', function (d, i)
            {
                return i * 20 + 10;
            }).attr('r', 4).style('stroke', function (d)
            {
                return self.color(d.name);
            });
            dataPoint.exit().remove();

            var tlength = this.chartSelect.select('.dataPoint-name').node().getComputedTextLength();

            // Adding margin for legend
            if (this.margin.right < tlength) {
                this.margin.right = tlength + 30;
                this.shouldRedraw = true;
            }
        } else if (this.margin.right > 10) {
            this.margin.right = 10;
            this.shouldRedraw = true;
        }
    };

    jsOMS.Chart.prototype.drawMarker = function (svg, x, y, dataPointEnter, dataPoint)
    {
        var self = this, temp;

        if (this.dataSettings.marker.visible) {
            temp = dataPointEnter.append('g').attr('class', 'dots').attr('clip-path', 'url(#clipper1)').selectAll('circle').data(function (d)
            {
                return d.points;
            }).enter().append('circle').attr('class', 'dot');
            dataPoint.select('.dots').style('stroke', function (d)
            {
                return self.color(d.name);
            }).selectAll('circle').transition().duration(500).attr('cy', function (d)
            {
                return y(d.y1);
            }).attr('cx', function (d)
            {
                return x(d.x1);
            }).attr('r', 4);
        }

        if (this.dataSettings.info.visible && this.dataSettings.marker.visible) {
            var div = this.chartSelect.append("div").attr("class", "charttooltip").style("opacity", 0);

            /* todo: allow also hover on charts without marker... not possible since hover only on marker and not on point? */
            temp.on("mouseover", function (d)
                {
                    var dim = div.node().getBoundingClientRect();
                    var pos = this.getBoundingClientRect();

                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(self.axis.x1.label.text + ': ' + d.x1 + "<br/>" + self.axis.y1.label.text + ': ' + d.y1)
                        .style("left", (pos.left + 3 - dim.width / 2) + "px")
                        .style("top", (pos.top - dim.height - 5) + "px");
                })
                .on("mouseout", function (d)
                {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        }
    };

    jsOMS.Chart.prototype.drawText = function (svg)
    {
        var temp, pos = 0, topmargin = 0;

        /* No subtitle without title */
        if (this.subtitle !== undefined && this.subtitle.visible && this.title !== undefined && this.title.visible) {
            pos = this.calculateHorizontalPosition(this.subtitle.position);

            temp = svg.append("text")
                .attr("class", "subtitle")
                .attr('y', this.position.title.top)
                .attr('x', pos)
                .style("text-anchor", this.subtitle.anchor)
                .text(this.subtitle.text);

            topmargin = 10;
            /* only add margin if subtitle exists */

            if (!this.defined.text.subtitle) {
                this.position.subtitle.top = temp.node().getBoundingClientRect().height / 2;
                this.margin.top += temp.node().getBoundingClientRect().height / 2 + topmargin;
                this.defined.text.subtitle = true;
                this.shouldRedraw = true;
            }
        }

        if (this.title !== undefined && this.title.visible) {
            pos = this.calculateHorizontalPosition(this.title.position);

            temp = svg.append("text")
                .attr("class", "title")
                .attr('y', -this.position.subtitle.top - topmargin)
                .attr('x', pos)
                .style("text-anchor", this.title.anchor)
                .text(this.title.text);

            if (!this.defined.text.title) {
                this.position.title.top = 0;
                this.margin.top += (temp.node().getBoundingClientRect().height) / 2 + this.position.subtitle.top / 2;
                this.defined.text.title = true;
                this.shouldRedraw = true;
            }
        }

        if (this.footer !== undefined && this.footer.visible) {
            pos = this.calculateHorizontalPosition(this.footer.position);

            temp = svg.append("text")
                .attr("class", "footer")
                .attr('y', this.dimension.height
                    - this.margin.bottom + this.position.footer.top + 10)
                .attr('x', pos)
                .style("text-anchor", this.footer.anchor)
                .text(this.footer.text);

            if (!this.defined.text.footer) {
                this.position.footer.top = temp.node().getBoundingClientRect().height;
                this.margin.bottom += temp.node().getBoundingClientRect().height + 10;
                this.defined.text.footer = true;
                this.shouldRedraw = true;
            }
        }
    };

    jsOMS.Chart.prototype.drawAxis = function (svg, xAxis1, yAxis1)
    {
        // draw clipper
        var defs = svg.append('svg').attr('width', 0).attr('height', 0).append('defs'), pos = 0, temp;
        defs.append('clipPath').attr('id', 'clipper1').append('rect').attr('x', 0).attr('y', 0)
            .attr('width',
                this.dimension.width
                - this.margin.right
                - this.margin.left
            )
            .attr('height',
                this.dimension.height
                - this.margin.top
                - this.margin.bottom
            );

        if (this.axis.x1 !== undefined && this.axis.x1.visible) {
            temp = svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + (
                        this.dimension.height
                        - this.margin.top
                        - this.margin.bottom
                    ) + ")")
                .call(xAxis1);

            if (this.axis.x1.label.visible) {
                pos = this.calculateHorizontalPosition(this.axis.x1.label.position);

                temp.append("text")
                    .attr('y', 45)
                    .attr('x', pos)
                    .style("text-anchor", this.axis.x1.label.anchor)
                    .text(this.axis.x1.label.text);
            }

            if (!this.defined.axis.x1) {
                this.margin.bottom += 50;
                this.defined.axis.x1 = true;
                this.shouldRedraw = true;
            }
        }

        if (this.axis.y1 !== undefined && this.axis.y1.visible) {
            temp = svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(0,0)")
                .call(yAxis1);

            if (this.axis.y1.label.visible) {
                pos = this.calculateVerticalPosition(this.axis.y1.label.position);

                temp.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", -this.margin.left + 10)
                    .attr('x', pos)
                    .style("text-anchor", this.axis.y1.label.anchor)
                    .text(this.axis.y1.label.text);
            }

            if (!this.defined.axis.y1) {
                this.margin.left += svg.select('.y.axis .tick').node().getBoundingClientRect().width + 25;
                this.defined.axis.y1 = true;
                this.shouldRedraw = true;
            }
        }

        if (this.axis.x2 !== undefined) {

        }

        if (this.axis.y2 !== undefined) {

        }
    };

    jsOMS.Chart.prototype.drawGrid = function (svg, xGrid, yGrid)
    {
        if (this.grid.x !== undefined && this.grid.x.visible) {
            svg.append("g")
                .attr("class", "x grid")
                .attr("transform", "translate(0," + (this.dimension.height - this.margin.top - this.margin.bottom) + ")")
                .call(xGrid);
        }

        if (this.grid.y !== undefined && this.grid.y.visible) {
            svg.append("g")
                .attr("class", "y grid")
                .call(yGrid);
        }
    };

    jsOMS.Chart.prototype.purge = function ()
    {
        this.margin = {top: 0, right: 0, bottom: 0, left: 0};
        this.dimension = {width: 0, height: 0};
        this.position = {
            title: {
                top: 0,
                left: 0
            },
            subtitle: {
                top: 0,
                left: 0
            },
            footer: {
                top: 0,
                left: 0
            },
            zoompanel: {
                top: 0,
                left: 0
            }
        };

        this.shouldRedraw = false;
        this.defined = {
            axis: {
                x1: false,
                y1: false
            },
            text: {
                title: false,
                subtitle: false,
                footer: false
            },
            legend: false
        };

        this.chartSelect.select("*").remove();
    };
}(window.jsOMS = window.jsOMS || {}));
