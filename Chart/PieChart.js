(function (jsOMS)
{
    jsOMS.Chart.PieChart = function (id)
    {
        this.chart = new jsOMS.Chart(id);

        // Setting default chart values
        this.chart.margin = {top: 5, right: 0, bottom: 0, left: 0};
        this.chart.color  = d3.scale.category10();
        this.chart.dataSettings.style.strokewidth = 0.3;
        this.chart.dataSettings.style.padding = 3;
        this.chart.subtype = 'pie';
    };

    jsOMS.Chart.PieChart.prototype.getChart = function ()
    {
        return this.chart;
    };

    jsOMS.Chart.PieChart.prototype.draw = function ()
    {
        let svg, arc, box = this.chart.chartSelect.node().getBoundingClientRect();

        this.chart.dimension = {
            width: box.width,
            height: box.height
        };

        let radius = (
            Math.min(this.chart.dimension.width, this.chart.dimension.height) / 2
            - Math.max(this.chart.margin.right + this.chart.margin.left,
                this.chart.margin.top + this.chart.margin.bottom)
            );

        arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius - radius*this.chart.dataSettings.style.strokewidth);

        svg = this.chart.chartSelect.append("svg")
            .attr("width", this.chart.dimension.width)
            .attr("height", this.chart.dimension.height)
            .append("g").attr("transform", "translate("
                + (this.chart.margin.left) + ","
                + (this.chart.margin.top) + ")");

        let dataPoint, dataPointEnter,
            temp       = this.drawData(svg, arc, dataPointEnter, dataPoint);
        dataPointEnter = temp[0];
        dataPoint      = temp[1];

        // todo: create own legend drawing
        this.chart.drawLegend(svg, dataPointEnter, dataPoint);
        this.chart.drawText(svg);

        if (this.chart.shouldRedraw) {
            this.redraw();
        }
    };

    jsOMS.Chart.PieChart.prototype.redraw = function ()
    {
        this.chart.shouldRedraw = false;
        this.chart.chartSelect.select("*").remove();
        this.draw();
    };

    jsOMS.Chart.PieChart.prototype.drawData = function (svg, arc, dataPointEnter, dataPoint)
    {
        let self = this,
            pie  = d3.layout.pie()
                .sort(null)
                .value(function (d)
                {
                    return d.value
                });

        dataPoint = svg.selectAll(".dataPoint").data(this.chart.dataset, function (c)
        {
            return c.id;
        });

        dataPoint.enter().append("g").attr("class", "dataPoint");

        dataPointEnter = dataPoint.selectAll("path")
            .data(function (d)
            {
                return pie(d.points);
            }).enter().append('path')
            .attr("transform", "translate("
                + ((this.chart.dimension.width - this.chart.margin.left - this.chart.margin.right) / 2 ) + ","
                + ((this.chart.dimension.height - this.chart.margin.bottom - this.chart.margin.top) / 2) + ")")
            .attr('fill', function (d)
            {
                return self.chart.color(d.data.name);
            })
            .attr('d', arc)
            .style('stroke', '#fff')
            .style('stroke-width', this.chart.dataSettings.style.padding);

        return [dataPointEnter, dataPoint];
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
            nums     = Math.ceil(Math.random() * 5) + 2;
            y1Seed   = Math.round(Math.random() * 10);
            tempData = {
                id: id,
                name: "Dataset " + id,
                points: (function ()
                {
                    var k, ref, results, prev;
                    results = [];
                    for (j = k = 1, ref = nums; 1 <= ref ? k <= ref : k >= ref; j = 1 <= ref ? ++k : --k) {
                        results.push({
                            name: 'Name ' + j,
                            value: y1Seed + Math.round(Math.random() * 5),
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

for (i = k = 1; k <= 1; i = ++k) {
    count = i;
    data.push(dataGen());
}

/*

var mychart = new jsOMS.Chart.PieChart('chart');
mychart.getChart().setData(data);
mychart.draw();

*/
