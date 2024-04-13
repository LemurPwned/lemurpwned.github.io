---
theme: dashboard
title: Arts
toc: false
--- 

# Short artstory

There's a wonderful webside called [WikiArt](www.wikiart.org) that hosts thousands of paintings, sculputres,
artist info and so on. It's quite temting to see what t-SNE could do with such a database.
Thus, below you can see an ensemble of 1500 images from WikiArt, preprocessed based on their
characteristics.
Firstly, the input data was processed to extract correct tags and create document-term matrix.
Then topic extraction on unustructured text was performed to obtain painting-characteristics which
will later be used as vectors in multidimensional space. Those vectors are then feeded into
the t-SNE algorithm to cast onto 2D.
As you probably see by now, t-SNE correctly clustered similar paintings, or paintings of the
same author, without having any information as to who made them. Additionally, paintings similar
in style or topic are close to each other.


```js 
const artData = FileAttachment("./arts/TSNE_SVD_FIXED.csv").csv({typed: true});
```


```js
Plot.plot({
    title: "Arts",
 
    width: 1200,
    height: 1200,
    grid: false,
    marks: [
        Plot.axisX({ticks: []}),
        Plot.axisY({ticks: []}),
        Plot.image(
            artData, {
                x: "x", y: "y", 
                src: "href",
                width: 80,
                title: "title",
                grid: false
            }
        ),
        Plot.tip(
            artData, 
            Plot.pointerX(
                {x: "x", y: "y", title: "title",
                title: (d) => [d.title, d.author, d.label].join("\n\n")}
            )
        )
    ]
  })
```