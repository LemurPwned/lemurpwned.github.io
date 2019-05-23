var alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
var heights = Array.from({ length: 10 }, () => Math.floor(Math.random() * 40));
var max = d3.max(heights);
var min = d3.min(heights);

var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  g = svg.append("g").attr("transform", "translate(32," + height / 2 + ")");

function update(data) {
  var t = d3.transition().duration(750);
  var polarity = Array.from({ length: 10 }, () => {
    if (Math.random() > 0.5) {
      return -1;
    } else {
      return 1;
    }
  });

  // JOIN new data with old elements.
  // var text = g.selectAll("text").data(data, function(d) {
  //   return d;
  // });

  var rectangles = g.selectAll("rect").data(data, function(d) {
    return d;
  });

  // EXIT old elements not present in new data.
  // text
  //   .exit()
  //   .attr("class", "exit")
  //   .transition(t)
  //   .attr("y", 60)
  //   .style("fill-opacity", 1e-6)
  //   .remove();

  // // UPDATE old elements present in new data.
  // text
  //   .attr("class", "update")
  //   .attr("y", -60)
  //   .style("fill-opacity", 1)
  //   .transition(t)
  //   .attr("x", function(d, i) {
  //     return i * 32;
  //   });

  // var rectangle = svgContainer
  //   .append("rect")
  //   .attr("x", 10)
  //   .attr("y", 10)
  //   .attr("width", 50)
  //   .attr("height", 100);
  // ENTER new elements present in new data.

  rectangles
    .exit()
    .attr("class", "exit")
    .transition(t)
    .attr("y", 60)
    .style("fill-opacity", 1e-6)
    .remove();

  rectangles
    .attr("class", "update")
    .attr("fill-opacity", 1)
    .style("fill", function(d, i) {
      if (polarity[i] == -1) return "orange";
      else return "green";
    })
    .attr("height", function(d) {
      return Math.random() * 60;
    })
    .attr("y", function(d, i) {
      // return 60;
      if (polarity[i] == 1) return 0;
      else return -d;
    });

  rectangles
    .enter()
    .append("rect")
    .attr("fill-opacity", 1)
    .attr("fill", "green")
    .attr("x", function(d, i) {
      return i * 50;
    })
    .attr("y", 60)
    .attr("width", 50)
    .attr("height", function(d) {
      return d;
    });
  // text
  //   .enter()
  //   .append("text")
  //   .attr("class", "enter")
  //   .attr("dy", ".35em")
  //   .attr("y", -60)
  //   .attr("x", function(d, i) {
  //     return i * 32;
  //   })
  //   .style("fill-opacity", 1e-6)
  //   .text(function(d) {
  //     return d;
  //   })
  //   .transition(t)
  //   .attr("y", 0)
  //   .style("fill-opacity", 1);
}

// The initial display.
update(heights);

// Grab a random sample of letters from the alphabet, in alphabetical order.
d3.interval(function() {
  heights = Array.from({ length: 10 }, () => Math.floor(Math.random() * 50));
  update(
    d3
      .shuffle(heights)
      .slice(0, Math.floor(Math.random() * 26))
      .sort()
  );
}, 1500);
