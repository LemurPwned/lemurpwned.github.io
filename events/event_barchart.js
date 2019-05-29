var formatPercent = d3.format(".0%");

var bar = d3
  .select("#event_chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + 100)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3
  .scaleBand()
  .range([0, width])
  .padding(0.4);
var y = d3.scaleLinear().range([height, 0]);
y.domain([0, 1]);
x.domain(cats);
var axisX = d3
  .axisBottom(x)
  .tickSize([])
  .tickPadding(10);

var yAxis = d3.axisLeft(y).tickFormat(formatPercent);
var xAxis = bar
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(axisX)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-1em")
  .attr("dy", "-0.5em")

  .attr("transform", "rotate(-45)");
bar
  .append("g")
  .attr("class", "y axis")
  .call(yAxis);

bar
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - height / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Percentage");

function update_barchart(data) {
  let dom = [];
  for (let i = 0; i < data.length; i++) {
    dom.push(data[i].category);
  }

  bar
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("cat", function(d) {
      return d.category;
    })
    .on("click", function(d) {
      console.log(d);
      d3.selectAll(".bar").style("opacity", 0.1);
      d3.select(this).style("opacity", 1);
      var all = d3.selectAll("circle");
      all.style("opacity", 0.01);
      all
        .filter(function(b) {
          return b.category == d.category;
        })
        .style("opacity", 1.0)
        .attr("r", 6);
    })
    .on("mouseleave", function(d) {
      d3.selectAll("circle").style("opacity", 1);
      d3.selectAll(".bar").style("opacity", 1);
    })
    .attr("class", "bar")
    .style("display", d => {
      return d.value === null ? "none" : null;
    })
    .style("fill", d => {
      return catColor(d.category);
    })
    .attr("x", d => {
      return x(d.category);
    })
    .attr("width", x.bandwidth())
    .attr("y", d => {
      return height;
    })
    .attr("height", 0)
    .transition()
    .duration(750)
    .delay(function(d, i) {
      return i * 150;
    })
    .attr("y", d => {
      return y(d.value);
    })
    .attr("height", d => {
      return height - y(d.value);
    });

  bar
    .selectAll(".label")
    .data(data)
    .enter()
    .append("text")
    .attr("class", "label")
    .style("display", d => {
      return d.value === null ? "none" : null;
    })
    .attr("x", d => {
      return x(d.category) + x.bandwidth() / 2 - 8;
    })
    .style("fill", d => {
      return catColor(d.category);
    })
    .attr("y", d => {
      return height;
    })
    .attr("height", 0)
    .transition()
    .duration(750)
    .delay((d, i) => {
      return i * 150;
    })
    .text(d => {
      return formatPercent(d.value);
    })
    .attr("y", d => {
      return y(d.value) + 0.1;
    })
    .attr("dy", "-.7em");
}
