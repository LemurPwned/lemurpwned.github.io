<script>
<meta charset="utf-8" />
<style>
  .land {
    fill: #ddd;
  }

  .state-borders {
    fill: none;
    stroke: #fff;
  }

  .airport-arc {
    fill: none;
  }

  .airport:hover .airport-arc {
    stroke: #f00;
  }

  .airport-cell {
    fill: none;
    stroke: #000;
    stroke-opacity: 0.1;
    pointer-events: all;
  }
</style>
<svg width="960" height="600"></svg>
<script src="https://d3js.org/d3.v4.min.js"></script>
<script src="https://d3js.org/topojson.v1.min.js"></script>
<script>
  var projection = d3
    .geoMercator()
    .scale(85)
    .translate([width / 2, height / 2]);

  var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  svg
    .append("text")
    .style("fill", "black")
    .style("font-size", "256x")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
    .attr("transform", "translate(300,10) rotate(0)");

  var projection = d3
    // .geoAlbers()
    .geoMercator()
    .translate([width / 2, height / 2])
    .scale(150);

  var radius = d3
    .scaleSqrt()
    .domain([0, 100])
    .range([0, 14]);

  var path = d3
    .geoPath()
    .projection(projection)
    .pointRadius(3.0);

  var voronoi = d3.voronoi().extent([[-1, -1], [width + 1, height + 1]]);

  d3.queue()
    .defer(
      d3.json,
      "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
    )
    .defer(d3.csv, "./airports.csv", typeAirport)
    // .defer(d3.csv, "./routes_X.csv", typeFlight)
    .defer(d3.csv, "./flights.csv", typeFlight)
    .await(ready);
  var c = 1;
  function ready(error, dataGeo, airports, flights) {
    if (error) throw error;

    var airportByIata = d3.map(airports, function(d) {
      return d.IATA;
    });
    flights.forEach(function(flight) {
      var source = airportByIata.get(flight.Source);
      var target = airportByIata.get(flight.Dest);
      source.arcs.coordinates.push([source, target]);
      target.arcs.coordinates.push([target, source]);
    });
    airports = airports.filter(function(d) {
      return d.arcs.coordinates.length;
    });

    svg
      .append("g")
      .selectAll("path")
      .data(dataGeo.features)
      .enter()
      .append("path")
      .attr("fill", "#b8b8b8")
      .attr("d", d3.geoPath().projection(projection))
      .style("stroke", "#fff")
      .style("stroke-width", 0);

    svg
      .append("path")
      .datum({ type: "MultiPoint", coordinates: airports })
      .attr("class", "airport-dots")
      .attr("d", path);

    var airport = svg
      .selectAll(".airport")
      .data(airports)
      .enter()
      .append("g")
      .attr("id", function(d) {
        return d.id;
      })
      .on("mouseover", handleMouseOver)
      .attr("class", "airport");

    airport.append("title").text(function(d) {
      return d.Name + "\n" + d.arcs.coordinates.length + " flights";
    });

    airport
      .append("path")
      .attr("class", "airport-arc")
      .attr("d", function(d) {
        return path(d.arcs);
      });

    airport
      .append("path")
      .data(voronoi.polygons(airports.map(projection)))
      .attr("class", "airport-cell")
      .attr("d", function(d) {
        return d ? "M" + d.join("L") + "Z" : null;
      });
  }

  function typeAirport(d) {
    d[0] = +d.Longitude;
    d[1] = +d.Latitude;
    d.arcs = { type: "MultiLineString", coordinates: [] };
    return d;
  }

  function typeFlight(d) {
    d.count = c;
    c += 1;
    return d;
  }

  var width = 600;
  var height = 300;

  function handleMouseOver(d, i) {
    let currentAirport =
      d.Name + "\n" + "connections: " + d.arcs.coordinates.length;
    svg
      .select("text")
      .text(currentAirport)
      .raise();
  }
</script>
</script>


## Welcome to GitHub Pages

You can use the [editor on GitHub](https://github.com/LemurPwned/lemurpwned.github.io/edit/master/index.md) to maintain and preview the content for your website in Markdown files.

Whenever you commit to this repository, GitHub Pages will run [Jekyll](https://jekyllrb.com/) to rebuild the pages in your site, from the content in your Markdown files.

### Markdown

Markdown is a lightweight and easy-to-use syntax for styling your writing. It includes conventions for

```markdown
Syntax highlighted code block

# Header 1
## Header 2
### Header 3

- Bulleted
- List

1. Numbered
2. List

**Bold** and _Italic_ and `Code` text

[Link](url) and ![Image](src)
```

For more details see [GitHub Flavored Markdown](https://guides.github.com/features/mastering-markdown/).

### Jekyll Themes

Your Pages site will use the layout and styles from the Jekyll theme you have selected in your [repository settings](https://github.com/LemurPwned/lemurpwned.github.io/settings). The name of this theme is saved in the Jekyll `_config.yml` configuration file.

### Support or Contact

Having trouble with Pages? Check out our [documentation](https://help.github.com/categories/github-pages-basics/) or [contact support](https://github.com/contact) and we’ll help you sort it out.
