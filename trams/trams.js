// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 660 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
// 
// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var lineColor = d3.scaleSequential().domain([1, 79])
    .interpolator(d3.interpolateViridis);


var sliderSimple = d3
    .sliderBottom()
    .min(0)
    .max(998)
    .width(300)
    .ticks(5)
    .default(1)
    .on('onchange', val => {
        if (val == 0) {
            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("opacity", 1)
                .attr("r", 1.5)
        }
        else {
            var id_val = Math.floor(val)
            d3.select('p#value-simple').text("Timestamp: " + id_val);

            d3.selectAll(".dot")
                .transition()
                .duration(200)
                .style("opacity", 1e-6)
                .attr("r", 3)
            d3.selectAll("#t" + id_val)
                .transition()
                .duration(200)
                .style("opacity", 1.0)
        }
    });

var gSimple = d3
    .select('div#slider-simple')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

gSimple.call(sliderSimple);

d3.select('p#value-simple').text("Timestamp: " + sliderSimple.value());

//Read the data
d3.csv("./trams.csv", function (data) {
    // Add X axis
    var x = d3.scaleLinear()
        .domain([19.85, 20.12])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
    // .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([50.0, 50.12])
        .range([height, 0]);
    svg.append("g")
    // .call(d3.axisLeft(y));

    var highlight = function (d) {

        if (d.line < 10) selected_line = "ten"
        if (d.line < 30) selected_line = "thirty"
        if (d.line < 50) selected_line = "fifty"
        if (d.line < 80) selected_line = "eighty"

        d3.selectAll(".dot")
            .transition()
            .duration(200)
            .style("fill", "lightgrey")
            .attr("r", 3)

        d3.selectAll("." + selected_line)
            .transition()
            .duration(200)
            .style("fill", lineColor(d.line))
            .attr("r", 7)
    }

    // Highlight the specie that is hovered
    var doNotHighlight = function () {
        d3.selectAll(".dot")
            .transition()
            .duration(200)
            .style("fill", "lightgrey")
            .attr("r", 5)
    }


    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", function (d) {
            return 't' + d.timestamp
        })
        .attr("class", function (d) {
            if (d.line < 10) return "dot " + "ten"
            if (d.line < 30) return "dot " + "thirty"
            if (d.line < 50) return "dot " + "fifty"
            if (d.line < 80) return "dot " + "eighty"
        })
        .attr("cx", function (d) {
            return x(d.longitude);
        })
        .attr("cy", function (d) {
            return y(d.latitude);
        })
        .attr("r", 1.5)
        .style("fill", function (d) {
            return lineColor(d.line);
        })
    // .on("mouseover", highlight)
    // .on("mouseleave", doNotHighlight)

})