
// var margin2 = { top: 40, right: 30, bottom: 30, left: 50 },
//     width = 460 - margin2.left - margin2.right,
//     height = 320 - margin2.top - margin2.bottom;

var greyColor = "#898989";
var barColor = d3.interpolateInferno(0.4);
var highlightColor = d3.interpolateInferno(0.3);

var formatPercent = d3.format(".0%");

var bar = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// y.domain([0, d3.max(data,  d => { return d.value; })]);

var x = d3.scaleBand()
    .range([0, width])
    .padding(0.4);
var y = d3.scaleLinear()
    .range([height, 0]);
y.domain([0, 1]);
x.domain([0., 45., 90., 135., 180., 225., 270., 315.])
var xAxis = d3.axisBottom(x).tickSize([]).tickPadding(10);
var yAxis = d3.axisLeft(y).tickFormat(formatPercent);
bar.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
bar.append("g")
    .attr("class", "y axis")
    .call(yAxis);



function update_barchart(data) {
    x.domain(data.map(d => { return d.heading; }));
    bar.selectAll('.bar')
        .exit()
        // .transition()
        // .duration(750)
        // .delay(function (d, i) {
        //     return i * 150;
        // })
        .attr('class', 'exit')
        .remove()

    bar.selectAll(".label").exit().attr('class', 'exit').remove()
    // bar.selectAll('.bar')
    //     .data(data)
    //     .attr()

    bar.selectAll(".bar")
        .attr("class", "bar")
        .style("display", d => { return d.value === null ? "none" : null; })
        .style("fill", d => {
            return d.value === d3.max(data, d => { return d.value; })
                ? highlightColor : barColor
        })
        .attr("x", d => { return x(d.heading); })
        .attr("width", x.bandwidth())
        .attr("y", d => { return height; })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay(function (d, i) {
            return i * 150;
        })
        .attr("y", d => { return y(d.value); })
        .attr("height", d => { return height - y(d.value); });

    bar.selectAll(".label")
        .enter()
        .attr("class", "label")
        .style("display", d => { return d.value === null ? "none" : null; })
        .attr("x", (d => { return x(d.heading) + (x.bandwidth() / 2) - 8; }))
        .style("fill", d => {
            return d.value === d3.max(data, d => { return d.value; })
                ? highlightColor : greyColor
        })
        .attr("y", d => { return height; })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay((d, i) => { return i * 150; })
        .text(d => { return formatPercent(d.value); })
        .attr("y", d => { return y(d.value) + .1; })
        .attr("dy", "-.7em");
    bar.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .style("display", d => { return d.value === null ? "none" : null; })
        .style("fill", d => {
            return d.value === d3.max(data, d => { return d.value; })
                ? highlightColor : barColor
        })
        .attr("x", d => { return x(d.heading); })
        .attr("width", x.bandwidth())
        .attr("y", d => { return height; })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay(function (d, i) {
            return i * 150;
        })
        .attr("y", d => { return y(d.value); })
        .attr("height", d => { return height - y(d.value); });

    bar.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "label")
        .style("display", d => { return d.value === null ? "none" : null; })
        .attr("x", (d => { return x(d.heading) + (x.bandwidth() / 2) - 8; }))
        .style("fill", d => {
            return d.value === d3.max(data, d => { return d.value; })
                ? highlightColor : greyColor
        })
        .attr("y", d => { return height; })
        .attr("height", 0)
        .transition()
        .duration(750)
        .delay((d, i) => { return i * 150; })
        .text(d => { return formatPercent(d.value); })
        .attr("y", d => { return y(d.value) + .1; })
        .attr("dy", "-.7em");
}

// var dataset = [{ "heading": "2014", "value": .07 },
// { "heading": "2015", "value": .13 },
// { "heading": "2016", "value": .56 },
// { "heading": "2017", "value": .95 },
// { "heading": "2018", "value": .81 }];
// update_barchart(dataset)