// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 80, left: 60 },
  width = 660 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var cats = [
  "Wystawy stałe",
  "Wystawy czasowe",
  "Pozostałe",
  "Muzyka klasyczna",
  "Muzyka rozrywkowa",
  "Festiwale teatralne",
  "Dziecięce różności",
  "Spotkania i slajdowiska",
  "Dziecięce warsztaty",
  "Spotkania i wykłady literackie",
  "Spektakle teatralne",
  "Festiwale muzyczne",
  "Cykle filmowe",
  "Pokazy filmowe",
  "Inne wydarzenia literackie",
  "Wykłady, spacery i warsztaty artystyczne",
  "Inne przedstawienia",
  "Inne koncerty",
  "Festiwale i przeglądy filmowe",
  "Spacery i zwiedzanie",
  "Akcje czytelnicze",
  "Kabaret",
  "Spektakle taneczne",
  "Festiwale",
  "Muzyka klubowa",
  "Targi i kiermasze",
  "Festiwale literackie"
];
var cat_ids = cats.map(function(v, indx) {
  return indx;
});

var catColor = d3
  .scaleOrdinal()
  .domain(cats)
  .range(d3.schemePaired);
//   .interpolator(d3.interpolateSinebow);

var svg = d3
  .select("#event_map")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3
  .select("#event_map")
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
      d.event_name +
        "<br>category: " +
        d.category +
        "<br> date: " +
        d.event_date
    )
    .style("left", d3.mouse(this)[0] + 90 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", d3.mouse(this)[1] + "px");
};

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
var mouseleave = function(d) {
  d3.select(this).attr("r", 4.5);

  d3.selectAll("circle").style("opacity", 1);
  d3.selectAll(".bar").style("opacity", 1);

  tooltip
    .transition()
    .duration(200)
    .style("opacity", 0);
};

var offset = [width / 2, height / 2];
var parallels = [50.1, 20.01];

var projection = d3
  .geoAlbers()
  .center([0, 50.0647])
  .rotate([-19.945, 0])
  .parallels(parallels)
  .translate(offset)
  .scale(108000);

var path = d3.geoPath().projection(projection);
let counts = {};
let tot = 0;

d3.queue()
  .defer(d3.csv, "./events/events.csv", typeEvents)
  .defer(d3.json, "./events/krak.geojson")
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
      return "t" + d.id;
    })
    .attr("cat", function(d) {
      return d.category;
    })
    .attr("cx", function(d) {
      return d.arcs[0];
    })
    .attr("cy", function(d) {
      return d.arcs[1];
    })
    .attr("name", function(d) {
      return d.event_name;
    })
    .attr("date", function(d) {
      return d.start;
    })
    .attr("r", 4.5)
    .style("fill", function(d) {
      return catColor(d.category);
    })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
    .on("click", function(d) {
      d3.selectAll(".bar").style("opacity", 0.1);

      d3.selectAll(".bar")
        .filter(function(b) {
          return b.category == d.category;
        })
        .style("opacity", 1.0);

      var all = d3.selectAll("circle");
      all.style("opacity", 0.01);
      all
        .filter(function(b) {
          return b.category == d.category;
        })
        .style("opacity", 1.0)
        .attr("r", 6);
    });

  let new_data = [];
  const keys = Object.keys(counts);
  for (let i = 0; i < keys.length; i++) {
    if (counts[keys[i]] / tot > 0.01)
      new_data.push({
        category: keys[i],
        value: counts[keys[i]] / tot
      });
  }
  update_barchart(new_data);
}

function typeEvents(d) {
  d.arcs = projection([+d.lat, +d.lon]);
  if (counts.hasOwnProperty(d.category)) {
    counts[d.category] += 1;
  } else {
    counts[d.category] = 1;
  }
  tot += 1;
  return d;
}
