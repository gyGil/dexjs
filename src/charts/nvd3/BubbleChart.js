/**
 *
 * This is the base constructor for a NVD3 BubbleChart.
 *
 * @param userConfig The chart's configuration.
 *
 * @returns {BubbleChart}
 *
 * @memberof dex/charts/nvd3
 *
 */
var BubbleChart = function (userConfig) {
    d3 = dex.charts.d3.d3v3;
    var chart;

    var defaults = {
        'parent': '#Nvd3_BubbleChartParent',
        'id': 'Nvd3_BubbleChartId',
        'class': 'Nvd3_BubbleChartClass',
        'resizable': true,
        'csv': {
            'header': [],
            'data': []
        },
        'width': "100%",
        'height': "100%",
        'legend': 'right'
    };

    var chart = new dex.component(userConfig, defaults);
    var internalChart;

    chart.render = function render() {
        d3 = dex.charts.d3.d3v3;
        var config = chart.config;
        var csv = config.csv;

        var types = csv.guessTypes();
        //dex.console.log("TYPES", types);;

        var xlabels = [];

        d3.select(config.parent).selectAll("*").remove();
        var groups = csv.group([0]);
        var nvd3Data = groups.map(function (group) {
            //dex.console.log("KEY", group.key, group);
            return {
                'key': group.key,
                'values': group.csv.data.map(function (row, i) {
                    //dex.console.log("ROW", row);
                    var values = {};
                    if (types[1] == "string") {
                        values.x = i;
                        values.xlabel = row[1];
                    }
                    else if (types[1] == "date") {
                        values.x = new Date(row[1]);
                    }
                    else {
                        values.x = +row[1];
                    }

                    if (types[2] == "string") {
                        values.y = i;
                        values.ylabel = row[2];
                    }
                    else if (types[2] == "date") {
                        values.y = new Date(row[2]);
                    }
                    else {
                        values.y = +row[2];
                    }

                    if (types[3] == "string") {
                        values.size = 1;
                    }
                    else if (types[2] == "date") {
                        values.size = 1;
                    }
                    else {
                        values.size = +row[3];
                    }

                    return values;
                })
            }
        });

        var nvd3Chart = nv.models.scatterChart()
            .showDistX(true)
            .showDistY(true)
            .useVoronoi(true)
            .color(d3.scale.category10().range())
            .duration(300);

        //nvd3Chart.xAxis.tickFormat(d3.format('.02f'));
        nvd3Chart.yAxis.tickFormat(d3.format('.1f'));
        nvd3Chart.xAxis
            .showMaxMin(false)
            .tickFormat(function (d) {
                if (types[1] == "date") {
                    return d3.time.format('%x')(new Date(d))
                }
                else if (types[1] == "string") {
                    return nvd3Data[0].values[d].xlabel;
                }
                else {
                    return d3.format(".1f")(d);
                }
            });

        nvd3Chart.yAxis
            .showMaxMin(false)
            .tickFormat(function (d) {
                if (types[2] == "date") {
                    //return d3.format(".1f")(d);
                    return d3.time.format('%x')(new Date(d))
                }
                else if (types[2] == "string") {
                    return nvd3Data[0].values[d].ylabel;
                }
                else {
                    return d3.format(".1f")(d);
                }
            });

        var svg = d3.select(config.parent)
            .append("svg")
            .attr("id", config["id"])
            .attr("class", config["class"])
            .attr('width', config.width)
            .attr('height', config.height)
            .datum(nvd3Data)
            .transition()
            .duration(500)
            .call(nvd3Chart);

        nv.utils.windowResize(nvd3Chart.update);

        internalChart = nv.addGraph(function () {
            return nvd3Chart;
        }, function () {
            d3.selectAll(".nv-legend-symbol").on('click',
                function () {
                    //dex.console.log("Clicked Legend Of", nvd3Chart.datum());
                });
        });

        return chart
    };

    chart.update = function () {
        d3 = dex.charts.d3.d3v3;
        //internalChart.load({'columns': chart.config.csv.data});
    };

    chart.clone = function clone(override) {
        return BubbleChart(dex.config.expandAndOverlay(override, userConfig));
    };

    $(document).ready(function () {
        // Make the entire chart draggable.
        //$(chart.config.parent).draggable();
    });

    return chart;
};

module.exports = BubbleChart;