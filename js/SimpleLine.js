/**
 * Created by wassx on 17.11.15.
 */

var mychart = {


    createSimpleLine: function () {
        var margin = {top: 20, right: 20, bottom: 30, left: 50};
        var height = 400;
        var width = 600;

        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
        var parseDate = d3.time.format("%d-%b-%y").parse;

        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");

        var line = d3.svg.line().x(function (d) {
            return x(d.date);
        }).y(function (d) {
            return y(+d.value);
        });

        var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        d3.json("data/data.json", function (error, data) {
            if (error) throw error;
            data.forEach(function (d) {
                d.date = parseDate(d.date);
                d.amount = +d.value;
            });

            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.amount;
            })]);

            svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
            svg.append("g").attr("class", "y axis").call(yAxis);

            svg.append("path").datum(data).attr("class", "line").attr("d", line);

        });
    },

    createBubble: function () {
        var diameter = 400;
        var colors = d3.scale.category10();

        var bubble = d3.layout.pack().sort(null).size([diameter, diameter]).padding(1.5);

        var svg = d3.select("body")
            .append("svg").attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble").append("g")
            .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom));

        d3.json("data/hierarchydata.json", function (error, data) {
            if (error) throw error;

            var node = svg.selectAll(".node").data(bubble.nodes(classes(data)).filter(function(d) { return !d.children; }))
                .enter().append("g").attr("class", "node").attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            node.append("title")
                .text(function(d) { return d.className + ": " + d.value; });

            node.append("circle")
                .attr("r", function(d) { return d.r;})
                .style("fill", function(d) {return colors(d.packageName)})
                .on("mouseover", function(d) {
                    d3.select(this).style("fill", function(d) {d3.rgb(getComputedStyle(this, null).getPropertyValue("fill")).brighter();})
                });

            node.append("text").text(function(d) { return d.className;})

        });

        function zoom() {
            svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

        function classes(root) {
            var classes = [];

            function recurse(name, node) {
                if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
                else classes.push({packageName: name, className: node.name, value: node.size});
            }

            recurse(null, root);
            return {children: classes};
        }

    }
}
