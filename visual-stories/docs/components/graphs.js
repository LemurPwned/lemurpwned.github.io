import * as Plot from "npm:@observablehq/plot";


export function spherePlot(points, longitude, latitude, { width, height } = {}) {
  return Plot.plot({
    width,
    height,
    projection: { type: "orthographic", rotate: [longitude, latitude] },
    marks: [
      Plot.sphere({ fill: null, stroke: "currentColor", strokeOpacity: .01 }),
      Plot.graticule({ strokeOpacity: 0.3 }),
      Plot.lineY(points, { x: "phi", y: "theta", stroke: "color", strokeOpacity: 0.7 })
    ],
    caption: `Longitude: ${longitude}, Latitude: ${latitude}`
  })
}


export function mplot(mdata, { width, height } = {}) {
  return Plot.plot({
    width,
    height,
    marginTop: 30,
    y: { domain: [-1.1, 1.1], label: "m(t)" },
    x: { label: "time" },
    color: { domain: ["x(t)", "y(t)", "z(t)"], legend: true },
    marks: [
      Plot.ruleY([0]),
      Plot.lineY(
        mdata, {
        x: "time",
        y: "x",
        stroke: "red",
        label: "x(t)"
      }),
      Plot.lineY(
        mdata, {
        x: "time",
        y: "y",
        stroke: "blue",
        label: "y(t)"
      }),
      Plot.lineY(
        mdata, {
        x: "time",
        y: "z",
        stroke: "yellow",
        label: "z(t)"
      }),

    ]
  });
}

export function fftplot(data, { width, height } = {}) {
  return Plot.plot({
    width,
    height,
    caption: "FFT of the signal in function of current density (GA/m^2)",
    x: { label: "Frequency (GHz)", type: "log", transform: d => d / 1e9 },
    y: { label: "Amplitude (dBm)", transform: d => 10 * Math.log10(d) },
    color: {
      legend: true, label: "Current Density (GA/m^2)",
      scheme: "inferno"
    },
    marks: [
      Plot.ruleY([0]),
      Plot.line(data, { x: "frequency", y: "amplitude", stroke: "current_density", tip: true, sort: { color: "stroke", reduce: "max", order: "ascending" } })
    ]
  });
}