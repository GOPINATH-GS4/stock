function donut_chart(element, width, height, data) {

    var c = document.getElementsByName(element);

    console.log('length of charts = ' + c.length);
    var width = width,
        height = height,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#FF0000", "#4B8A08", "#5F04B4", "#6b486b", "#2E2EFE6", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.y;
        });


    for (var i = 0; i < c.length; i++) {
        console.log(c[i]);
        var svg = d3.select(c[i])
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function(d) {
                return color(d.data.x);
            });

    }
}

function barChart(element, width, height, data) {

    var chart1 = new Highcharts.Chart({
        chart: {
            renderTo: element,
            type: 'bar'
        },
        title: {
            text: 'Fruit Consumption'
        },
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: [{
            name: 'Jane',
            data: [1, 0, 4]
        }, {
            name: 'John',
            data: [5, 7, 3]
        }]
    });
}

function drawLabel(ren, text, x, y, fillColor, stroke, height, width, fontColor, fontSize, fontWeight) {
    return ren.label(text, x, y)
        .attr({
            fill: fillColor,
            stroke: stroke,
            'stroke-width': 2,
            padding: 5,
            r: 5,
        })
        .css({
            color: fontColor,
            fontSize: fontSize
        })
        .add()
        .shadow(true);
}

function participantFlowChart(element, data) {

    var flowChart = new Highcharts.Chart({
        chart: {
            renderTo: element,
            backgroundColor: '#00B1B5',
            events: {
                load: function() {

                    console.log('element  ' + element.offsetHeight + ':' + element.offsetWidth);
                    var height = element.offsetHeight;
                    var width = element.offsetWidth;
                    var start = 70;
                    var lane = 100;
                    var take = width / 880 * 50;
                    var pad = 10;
                    var center = element.offsetWidth / 2;
                    var fontSize = width / 880 * 14 + 'px';
                    var level = 0;
                    var no_of_trts = 4;



                    // Draw the flow chart
                    var ren = this.renderer,
                        colors = Highcharts.getOptions().colors;

                    var root = drawLabel(ren, '# participants', center - take, start + (lane * level), colors[1], 'white', 25, 75, 'white', fontSize, 'bold');
                    drawLabel(ren, '120', center - take + root.width, start + (lane * level), 'red', null, null, null, 'white', 8, 'bold');

                    // No of sub titles  eg  3
                    var titleWidth = width / no_of_trts;
                    var rootCenterY = center - take + root.width / 2;
                    var rootCenterX = start + root.height;
                    level = 1;

                    for (var i = 0; i < no_of_trts; i++) {
                        var ncenter = (i * titleWidth) + titleWidth / 2;
                        var trt = drawLabel(ren, 'treatment-' + i, ncenter - take, start + (lane * level), colors[1], 'white', 25, 75, 'white', fontSize, 'bold');

                        var leafCenterY = ncenter - take + trt.width / 2;
                        var leafCenterX = start + lane;
                        ren.path(['M', rootCenterY, rootCenterX, 'L', leafCenterY, leafCenterX])
                            .attr({
                                'stroke-width': 2,
                                stroke: colors[2]
                            })
                            .add();
                        drawLabel(ren, '40', (rootCenterY + leafCenterY) / 2, (rootCenterX + leafCenterX) / 2, 'red', null, null, null, 'white', 8, 'bold');

                        var _titleWidth = width / (no_of_trts * 2);
                        var _rootCenterY = ncenter - take + trt.width / 2;
                        var _rootCenterX = start + (1 * lane) + trt.height;

                        for (var j = 0; j < 2; j++) {
                            var _ncenter = (j * _titleWidth) + (i * titleWidth) + _titleWidth / 2;
                            var active = drawLabel(ren, (!j) ? 'Active/Complete' : 'Discontinued', _ncenter - take, start + (2 * lane), colors[1], 'white', 25, 75, 'white', fontSize, 'bold');
                            var _leafCenterY = _ncenter - take + active.width / 2;
                            var _leafCenterX = start + (2 * lane);
                            ren.path(['M', _rootCenterY, _rootCenterX, 'L', _leafCenterY, _leafCenterX])
                                .attr({
                                    'stroke-width': 2,
                                    stroke: colors[2]
                                })
                                .add();
                            drawLabel(ren, (!j) ? '30' : '10', (_rootCenterY + _leafCenterY) / 2, (_rootCenterX + _leafCenterX) / 2, 'red', null, null, null, 'white', fontSize, 'bold');
                        }
                    }

                }
            }
        },
        title: {
            text: 'NCT00001',
            style: {
                color: 'red'
            }
        }

    });
}