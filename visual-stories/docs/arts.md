---
theme: dashboard
title: Arts
toc: false
--- 


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