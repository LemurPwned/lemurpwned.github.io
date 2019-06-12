#### Trams

To visualise traffic on legs of Kraków's tram network, the map shows position of trams over the whole day of 13 of March. The different colors indicate lines, additionally the intensity shows number of trams in single location.

![](images/map.png)

Popularity of tram line based of number of recorded points:

![](images/wheel.png)

Here's live tram peak! Additionally, we can see the current distributions of headings (tram orientations).
Move timeline to -1 to see the whole day. Hourly checkpoints apply. Observe cool night-day cycle!

<HTML>
  <style>
    .container {
      float: left;
    }
  </style>
  <h2>Krakow - tram distribution over time and heading barchart</h2>
  <div class="container" id="tram_map"></div>
  <div class="container" id="chart"></div>

  <div class="row align-items-center">
    <div class="col-sm-2"><p id="value-simple"></p></div>
    <div class="col-sm"><div id="slider-simple"></div></div>
  </div>
  <script src="https://d3js.org/topojson.v1.min.js"></script>
  <script src="https://d3js.org/d3.v4.min.js" type="text/javascript"></script>
  <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
  <script src="https://unpkg.com/d3-simple-slider"></script>
  <script src="./trams/trams.js" type="text/javascript"></script>
  <script src="./trams/barchart.js" type="text/javascript"></script>
</HTML>
