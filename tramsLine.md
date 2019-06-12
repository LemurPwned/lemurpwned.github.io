#### Tram Line Timeline 

We could suspect that the biggest airlines will be mostly using the same airplanes right?
Let's find out!

It seems that this is mostly true that there are several *classic* planes 
popular across multiple airlines. However, we can se several outsiders as well.


<HTML>
<style>
  body {
    font-family: "Open Sans", sans-serif;
  }
  #main {
    width: 960px;
  }
  .axis .domain {
    display: none;
  }
</style>
<body onload='main()'>
    <div id="slopegraph"></div>
</body>


 <script src="https://d3js.org/d3.v4.min.js"></script>

<script type="text/javascript">
    function main() {

        WIDTH = 600;
        HEIGHT = 30650;

        LEFT_MARGIN = 150;
        RIGHT_MARGIN = 150;
        TOP_MARGIN = 50;
        BOTTOM_MARGIN = 50;
        TIME_SCALE = 2000
        time0 = 1552449600000

        var t = d3.json("./trams_line/data52_small.json", function(error, data){
            // console.log("data")
            // console.log(data["Czerwone Maki P+R"]['8059232507168141832'])
            example = data["Czerwone Maki P+R"]['8059232507168141832']
            maki = data["Czerwone Maki P+R"]
            piast = data["Os.Piastow"]

            var lineFunction = d3.line()
                .x(function(d) { return d.x; })
                .y(function(d) { return d.y; })
                // .interpolate("linear");

            var sg = d3.select('#slopegraph')
                .append('svg')
                .attr('width', WIDTH)
                .attr('height', HEIGHT);


            for (var key in maki){
                example = maki[key]
                // console.log(key)
                // console.log(example)
                startTime = example['start_time']
                sum_distance = example['sum_distance']
                if (sum_distance == 0){
                    continue
                }
                if (example['distances'].length < 10){
                    continue
                }
                var aggrX = LEFT_MARGIN
                var aggrY = TOP_MARGIN + (startTime-time0)/TIME_SCALE
                console.log(aggrY)
                var curve = []
                delta = 0.8*WIDTH*(767773 - sum_distance)/767773
                for (var i = 0; i < example['distances'].length; i++) {
                    elem = example['distances'][i]
                    d = elem['distance']
                    aggrX += 0.8*WIDTH*d/767773
                    aggrY += elem['deltaT']/TIME_SCALE
                    curve.push({ "x": aggrX + delta, "y": aggrY})
                }
                console.log(curve)
                var lineGraph = sg.append("path")
                    .attr("d", lineFunction(curve))
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
            }

           
            for (var key in piast){
                example = piast[key]
                // console.log(key)
                // console.log(example)
                startTime = example['start_time']
                sum_distance = example['sum_distance']
                if (sum_distance == 0){
                    continue
                }
                if (example['distances'].length < 10){
                    continue
                }

                var aggrX = LEFT_MARGIN + WIDTH*0.8
                var aggrY = TOP_MARGIN + (startTime-time0)/TIME_SCALE
                console.log(aggrY)
                var curve = []
                delta = 0.8*WIDTH*(767773 - sum_distance)/767773

                for (var i = 0; i < example['distances'].length; i++) {
                    elem = example['distances'][i]
                    d = elem['distance']
                    aggrX -= 0.8*WIDTH*d/767773
                    aggrY += elem['deltaT']/TIME_SCALE
                    curve.push({ "x": aggrX-delta, "y": aggrY})
                }
                console.log(curve)
                var lineGraph = sg.append("path")
                    .attr("d", lineFunction(curve))
                    .attr("stroke", "green")
                    .attr("stroke-width", 2)
                    .attr("fill", "none");
            }
            for (var i = 0; i < 400; i++) {
                step = 1000 * 60 * 15
                var newDate = new Date();
                newDate.setTime(time0 + step * i);
                var hour = newDate.getHours();
                var min = newDate.getMinutes();
                hour = (hour < 10 ? "0" : "") + hour;
                min = (min < 10 ? "0" : "") + min;

                sg.append('svg:text')
                    .attr('x', LEFT_MARGIN - 50)
                    .attr('y', TOP_MARGIN/2 + step * i / TIME_SCALE )
                    .attr('text-anchor', 'end')
                    .attr('opacity', .5)
                    .text(hour + ":" + min) 
               }
            



        })
}
</script>
</HTML>


