##### This might be not much but...

So here's an interesting finding. If we supply t-SNE with the airport destinations (destination latitude and longitude)
then we get the picture below (the subset of destinations is reduced to several most popular ones).
3 stripes - what do they represent?

<!DOCTYPE html>
<meta charset="utf-8" />

<script src="https://d3js.org/d3.v4.js"></script>

<h2>Tsne for Open flight data - top destinations</h2>
<div id="TSNE"></div>

<script src="./tsne/tsne.js"></script>
