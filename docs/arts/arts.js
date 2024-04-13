// set the dimensions and margins of the graph
var margin = { top: 10, right: 20, bottom: 20, left: 20 },
  width = 820 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#artTSNE")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var zoomView = d3 
  .select("#imageTooltip")
  .append("svg")
  .attr("width", width / 2 + margin.left + margin.right)
  .attr("height", height / 2 + margin.top + margin.bottom)
  .attr("transform", "translate(" + margin.left + "," + 10 * margin.top + ")");

var tooltip = d3
  .select("#artTSNE")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px");

zoomView
  .append("g")
  .selectAll(".zoomView")
  .data([""])
  .enter()
  .append("image")
  .attr("class", "zoomView")
  .attr("id", "1")
  .attr("xlink:href", "")
  .attr("width", 300)
  .attr("height", 300)
  .style("opacity", 1.0);

var mousemove = function (d) {
  var labels = d.label;
  var labels = labels.replace(/,/g, "");
  labels = labels.replace(/\[/g, "");
  labels = labels.replace(/\]/g, "");
  labels = labels.replace(/None/g, "");

  tooltip
    .html("Author: " + d.author + "<br/>Labels: " + labels)
    .style("left", d3.mouse(this)[0] + 90 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", d3.mouse(this)[1] + "px")
    .style("opacity", 1.0);
};

//Read the data
d3.csv("/arts/TSNE_ART_DICT_REVISED_SVD_CLUSTERING.csv", function (data) {
  // Add X axis
  var max = 2.5;
  var x = d3
    .scaleLinear()
    .domain([-max, max])
    .range([0, width]);
  svg.append("g").attr("transform", "translate(0," + height + ")");

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([-max, max])
    .range([height, 0]);

  svg
    .append("g")
    .selectAll("point")
    .data(data)
    .enter()
    .append("image")
    .attr("class", "point")
    .attr("xlink:href", function (d) {
      return d.href;
    })
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("y", function (d) {
      return y(d.y);
    })
    .attr("id", function (d) {
      return d.idx;
    })
    .attr("lab", function (d) {
      return d.label;
    })
    .attr("width", 32)
    .attr("height", 32)
    .style("opacity", 1.0)

    .on("mouseover", function (d) {
      d3.selectAll(".point").style("opacity", 0.3);
      d3.select(this)
        .attr("width", 128)
        .attr("height", 128)
        .style("opacity", 1.0);
    })
    .on("mouseleave", function (d) {
      d3.selectAll("image").style("opacity", 1.0);

      d3.select(this)
        .attr("width", 32)
        .attr("height", 32);
    })
    .on("mousemove", mousemove)
    .on("click", function (d) {
      d3.select(".zoomView").attr("xlink:href", d.href);
    });
});
