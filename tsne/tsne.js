// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  width = 1000 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
// append the svg object to the body of the page
var svg = d3
  .select("#TSNE")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var z = d3
  .scaleLinear()
  .domain([
    93,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900,
    10000,
    2000,
    4000,
    5000,
    7000,
    8000,
    9000
  ])
  .range([
    "#2c7bb6",
    "#00a6ca",
    "#00ccbc",
    "#90eb9d",
    "#ffff8c",
    "#f9d057",
    "#f29e2e",
    "#e76818",
    "#d7191c"
  ]);

var tooltip = d3
  .select("#TSNE")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px");

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
var mouseover = function(d) {
  tooltip.style("opacity", 1);
};

var mousemove = function(d) {
  d3.select(this).attr("r", 6);
  tooltip
    .html(
      "Source: " +
        d.source +
        ", airline: " +
        d.airline +
        ", distance: " +
        Math.ceil(d.distance)
    )
    .style("left", d3.mouse(this)[0] + 90 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", d3.mouse(this)[1] + "px");
};

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = function(d) {
  d3.select(this).attr("r", 1.5);

  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0);
};
//Read the data
d3.csv("./tsne/TSNE.csv", function(data) {
  // Add X axis
  var x = d3
    .scaleLinear()
    .domain([0, 0])
    .range([0, width]);
  svg
    .append("g")
    .attr("class", "myXaxis") // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + height + ")")
    // .call(d3.axisBottom(x))
    // .call(g => g.select("domain").remove())
    .attr("opacity", "0");
  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([-50, 50])
    .range([0, height]);
  svg
    .append("g")
    // .call(d3.axisLeft(y))
    .call(g => g.select("domain").remove());
  // Add dots
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return x(d.x);
    })
    .attr("cy", function(d) {
      return y(d.y);
    })
    .attr("r", 1.5)
    .style("fill", function(d) {
      return z(d.distance);
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  // new X axis
  x.domain([-35, 35]);
  svg
    .select(".myXaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1");
  // .call(d3.axisBottom(x));

  svg
    .selectAll("circle")
    .transition()
    .delay(function(d, i) {
      return i * 3;
    })
    .duration(2000)
    .attr("cx", function(d) {
      return x(d.x);
    })
    .attr("cy", function(d) {
      return y(d.y);
    });
});
