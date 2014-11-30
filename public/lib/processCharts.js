function chart_info() {

    var c = document.getElementsByName('charts');

    console.log('length of charts = ' + c.length);
    var width = 200,
        height = 150,
        radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#FF0000", "#4B8A08", "#5F04B4", "#6b486b", "#2E2EFE6", "#d0743c", "#ff8c00"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 40);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.data;
        });

    var data = [{
        "group": "trt1",
        "data": 24
    }, {
        "group": "trt2",
        "data": 84
    }, {
        "group": "trt3",
        "data": 8
    }, {
        "group": "trt4",
        "data": 50
    }];

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
                return color(d.data.data);
            });

    }
}