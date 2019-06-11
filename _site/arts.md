#### How to classify arts?

There's a wonderful webside called [WikiArt](www.wikiart.org) that hosts thousands of paintings, sculputres,
artist info and so on. It's quite temting to see what t-SNE could do with such a database.
Thus, below you can see an ensemble of 1500 images from WikiArt, preprocessed based on their
characteristics. As you probably see by now, t-SNE correctly clustered similar paintings, or paintings of the
same author, without having any information as to who made them.

<HTML>
  <style>
    .container {
      float: left;
    }
  </style>
  <h2>Arts - tsne clustering of WikiArt</h2>
  <div class="container" id="artTSNE"></div>
  <div class="container" id="imageTooltip"></div>

  <script src="https://d3js.org/topojson.v1.min.js"></script>
  <script src="https://d3js.org/d3.v4.min.js" type="text/javascript"></script>
  <script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>
  <script src="./arts/arts.js" type="text/javascript"></script>
</HTML>




Conclusion:
t-SNE wow! such respect.
