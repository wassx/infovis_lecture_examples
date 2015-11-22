/**
 * Created by wassx on 17.11.15.
 */

var mychart = {

    createSimpleLine: function () {
        //Init vars for drawing area
        var margin = {top: 20, right: 20, bottom: 30, left: 50};
        var height = 400;
        var width = 600;

        //Init helper method for parsing date formats
        var parseDate = d3.time.format("%d-%b-%y").parse;

        //Defining scales by setting their attributes and range
        //https://github.com/mbostock/d3/wiki/Scales
        var x = d3.time.scale().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);

        //Init the axis by applying scales and setting label orientation
        var xAxis = d3.svg.axis().scale(x).orient("bottom");
        var yAxis = d3.svg.axis().scale(y).orient("left");

        //Init a line with functions for each coordinate (x,y)
        var line = d3.svg.line().x(function (d) {
            return x(d.date);
        }).y(function (d) {
            return y(+d.value);
        });

        //Selects the "body" element and appends a "svg" with attributes.
        //The svg has an element ("g") appended with translation to position the "drawing area"
        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        //Initiating the data import
        d3.json("../data/data.json", function (error, data) {
            if (error) throw error;

            //Step through each data node and do various stuff.
            //In this case it's formatting date and saving the value to a different var of the node.
            data.forEach(function (d) {
                d.date = parseDate(d.date);
                d.amount = +d.value;
            });

            //Setting the value range for the x axis
            x.domain(d3.extent(data, function (d) {
                return d.date;
            }));
            //Setting the value range for the y axis. From 0 to maximum y value.
            y.domain([0, d3.max(data, function (d) {
                return d.amount;
            })]);

            //Appending an element for the x axis
            svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);
            //Appending an element for the y axis
            svg.append("g").attr("class", "y axis").call(yAxis);

            //Drawing the line
            svg.append("path").datum(data).attr("class", "line").attr("d", line);

        });
    }
}
