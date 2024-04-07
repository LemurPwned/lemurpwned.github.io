---
theme: dashboard
title: Event map in Krakow
toc: false
---

# Events in Kraków

The city core is not the only vibrant place.



```js 
const geoData = FileAttachment("./data/krak.geojson").json();
const events = FileAttachment("./data/events.csv").csv({typed: true});
```
```js
Plot.plot({
  color: {
    legend: true,
    type: "categorical",
    label: "Category",
  },
  marks: [
    Plot.geo(geoData),
    Plot.dot(events, {x: "lat", y: "lon", fill: "category", fillOpacity: 1. ,
    title: "event_name",
    }),
    Plot.tip(events, Plot.pointerX({x: "lat", y: "lon", title: "event_name",
      title: (d) => [d.event_name, d.category, d.location,
      `${d.start}-${d.end}`].join("\n\n")
    }))    
  ]
})
```