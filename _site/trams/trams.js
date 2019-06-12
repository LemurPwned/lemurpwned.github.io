// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 80, left: 60 },
  width = 660 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3
  .select("#tram_map")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var lineColor = d3
  .scaleSequential()
  .domain([1, 79])
  .interpolator(d3.interpolateInferno);

var max_range = 1000;
var step = 15;
var tmp_step = Math.ceil(1000 / step);

var night_day = d3
  .scaleSequential()
  .domain([1, step])
  .interpolator(d3.interpolateBlues);

var tooltip = d3
  .select("#tram_map")
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
    .html("Line: " + parseInt(d.line) + ", heading: " + d.heading)
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

var sliderSimple = d3
  .sliderBottom()
  .min(0)
  .max(step - 1)
  .width(300)
  .ticks(5)
  .default(1)
  .on("onchange", val => {
    if (val == 0) {
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .attr("r", 1.5);
    } else {
      var id_val = Math.floor(val);
      d3.select("p#value-simple").text("Timestamp: " + id_val);

      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("opacity", 1e-6)
        .attr("r", 3);
      d3.select("svg").style("background-color", night_day(id_val));
      d3.select("#chart").style("background-color", night_day(id_val));
      let counts = {};
      let tot = 0;
      for (let i = val * tmp_step; i <= val * tmp_step + tmp_step; i++) {
        let id = parseInt(Math.ceil(i));
        let el = undefined;
        el = d3.select("#t" + id);

        try {
          let heading = el.attr("headi");
          if (counts.hasOwnProperty(heading)) {
            counts[heading] += 1;
          } else {
            counts[heading] = 1;
          }
          tot += 1;
        } catch (err) {}

        el.transition()
          .duration(200)
          .style("opacity", 1.0)
          .attr("r", 4);
      }
      let new_data = [];
      const keys = Object.keys(counts);
      for (let i = 0; i < keys.length; i++) {
        new_data.push({
          heading: keys[i],
          value: counts[keys[i]] / tot
        });
      }
      update_barchart(new_data);
    }
  });

var gSimple = d3
  .select("div#slider-simple")
  .append("svg")
  .attr("width", 500)
  .attr("height", 100)
  .append("g")
  .attr("transform", "translate(30,30)");

gSimple.call(sliderSimple);

d3.select("p#value-simple").text("Timestamp: " + sliderSimple.value());
//Read the data

var offset = [width / 2, height / 2];
var parallels = [50.1, 20.01];

var projection = d3
  .geoAlbers()
  .center([0, 50.0647])
  .rotate([-19.945, 0])
  .parallels(parallels)
  .translate(offset)
  .scale(105000);

var path = d3.geoPath().projection(projection);

d3.queue()
  .defer(d3.csv, "./trams/trams.csv", typeTram)
  .defer(d3.json, "./trams/krak.geojson")
  .await(ready);

function ready(error, data, topojson) {
  // Add X axis
  if (error) console.log(error);
  svg
    .selectAll("path")
    .data(topojson.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("opacity", 0.1)
    .style("stroke", "#fff")
    .style("stroke-width", 0.7);

  svg.append("g").attr("transform", "translate(0," + height + ")");

  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("id", function(d) {
      return "t" + d.timestamp;
    })
    .attr("headi", function(d) {
      return d.heading;
    })
    .attr("class", function(d) {
      if (d.line < 10) return "dot " + "ten";
      if (d.line < 30) return "dot " + "thirty";
      if (d.line < 50) return "dot " + "fifty";
      if (d.line < 80) return "dot " + "eighty";
    })
    .attr("cx", function(d) {
      return d.arcs[0];
    })
    .attr("cy", function(d) {
      return d.arcs[1];
    })
    .attr("r", 1.5)
    .style("fill", function(d) {
      return lineColor(d.line);
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
}
function typeTram(d) {
  d[0] = +d.longitude;
  d[1] = +d.latitude;
  d.arcs = projection([+d.longitude, +d.latitude]);
  return d;
}
