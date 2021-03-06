// create the svg
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
var svg = d3.select("svg"),
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom,
  g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var txt = g
  .append("text")
  .attr("x", width / 2)
  .attr("y", 10 - margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "bold")
  .text("Equipment used by 10 biggest airlines");
// set x scale
var x = d3
  .scaleBand()
  .rangeRound([0, width])
  .paddingInner(0.05)
  .align(0.1);

// set y scale
var y = d3.scaleLinear().rangeRound([height, 0]);

// set the colors
var z = d3
  .scaleOrdinal()
  .range([
    "#98abc5",
    "#8a89a6",
    "#7b6888",
    "#6b486b",
    "#a05d56",
    "#d0743c",
    "#ff8c00"
  ]);

// load the csv and create the chart
d3.csv(
  "./stacked-airplanes/stacked_planes.csv",
  function(d, i, columns) {
    for (i = 1, t = 0; i < columns.length; ++i)
      t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
  },
  function(error, data) {
    if (error) throw error;
    var keys = data.columns.slice(1);
    console.log(y(keys));
    //   var key_width_mapping = keys.map(function(d) {
    //     var i = keys.indexOf(d);
    //     return {
    //       low: i,
    //       high: i + 80 * (i + 1)
    //     };
    //   });
    data.sort(function(a, b) {
      return b.total - a.total;
    });
    x.domain(
      data.map(function(d) {
        return d.airlines;
      })
    );
    y.domain([
      0,
      d3.max(data, function(d) {
        return d.total;
      })
    ]).nice();
    z.domain(keys);

    g.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter()
      .append("g")
      .attr("fill", function(d) {
        return z(d.key);
      })
      .selectAll("rect")
      .data(function(d) {
        return d;
      })
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return x(d.data.airlines);
      })
      .attr("y", function(d) {
        return y(d[1]);
      })
      .attr("height", function(d) {
        return y(d[0]) - y(d[1]);
      })
      .attr("width", x.bandwidth())
      .on("mouseover", function() {
        tooltip.style("display", null);
      })
      .on("mouseout", function() {
        tooltip.style("display", "none");
        d3.selectAll("rect").style("opacity", 1);
      })
      .on("click", function(d) {
        d3.selectAll("rect").style("opacity", 0.1);
        var type = getKeyByValue(d.data, d[1] - d[0]);
        d3.selectAll("rect")
          .filter(function(b) {
            return b == type;
          })
          .style("opacity", 1.0);

        d3.selectAll("rect").style("opacity", function(d) {
          var curr_rect_key = getKeyByValue(d.data, d[1] - d[0]);
          if (curr_rect_key == type) {
            return 1.0;
          } else {
            return 0.1;
          }
        });

        d3.select(this).style("opacity", 1.0);
      })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip.attr(
          "transform",
          "translate(" + xPosition + "," + yPosition + ")"
        );
        var cat = getKeyByValue(
          d3.select(this)._groups[0][0].__data__.data,
          d[1] - d[0]
        );

        tooltip.select("text").text(`"${cat}": ${d[1] - d[0]}`);
      });

    g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");

    var legend = g
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) {
        return d;
      });
  }
);

// Prep the tooltip bits, initial display is hidden
var tooltip = svg
  .append("g")
  .attr("class", "tooltip")
  .style("display", "none");

tooltip
  .append("rect")
  .attr("width", 60)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip
  .append("text")
  .attr("x", 30)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");
