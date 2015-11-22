/**
 * Created by wassx on 18.11.15.
 */

var mybubbles = {
    createBubble: function () {
        var diameter = 400;
        var colors = d3.scale.category10();

        var bubble = d3.layout.pack().sort(null).size([diameter, diameter]).padding(1.5);

        var svg = d3.select("body")
            .append("svg").attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble").append("g")
            .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom));

        d3.json("../data/hierarchydata.json", function (error, data) {
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