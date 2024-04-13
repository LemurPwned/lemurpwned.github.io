---
title: Spintronics
---

# Spin and magnetism
```js
import {spherePlot, mplot, fftplot} from "./components/graphs.js";
import * as Inputs from "npm:@observablehq/inputs";

const colorScale = d3.scaleSequential(d3.interpolateInferno);

```
## Quick overview 

In a macroscopic sense, magnetism is the result of the alignment of magnetic moments in a material. The magnetic moment is a vector quantity over volume of said material geometry:
  
```tex
\mathbf{M} = \int \, dV \mathbf{m} 
```

where ${tex`\mathbf{M}`} is the magnetisation, ${tex`\mathbf{m}`} is the magnetic moment, and ${tex`dV`} is the volume element. The magnetic moment is the result of the spin of the electrons in the material. The spin is an intrinsic property of the electron, and it can be thought of as a tiny magnet with a magnetic moment ${tex`\mu_B`} (Bohr magneton). The spin of the electron can be either up or down, and the magnetic moment is aligned with the spin and the magnetic moment of the electron is given by

```tex
\mathbf{m} = g \mu_B \mathbf{s}
```

where ${tex`g`} is the g-factor, ${tex`\mu_B`} is the Bohr magneton, and ${tex`\mathbf{s}`} is the spin of the electron. The g-factor is a dimensionless constant that accounts for the relativistic effects on the electron's magnetic moment. The spin of the electron is quantised, and it can take on two values: ${tex`\pm \frac{1}{2}`}. 

## Dynamics 

The pivotal equation in the magnetisation dynamics is the Landau-Lifshitz-Gilbert (LLG) equation, which describes the precession of the magnetisation around the effective field ${tex`\mathbf{H}_{\text{eff}}`} and the damping of the magnetisation due to the Gilbert damping ${tex`\alpha`}:

```tex
\frac{d\mathbf{m}}{dt} = -\gamma \mathbf{m} \times \mathbf{H}_{\text{eff}} + \alpha \mathbf{m} \times \frac{d\mathbf{m}}{dt} \quad (1)
```

where ${tex`\mathbf{m} = \mathbf{M}/M_s`} is the versor of the magnetisation, ${tex`\mathbf{H}_{\text{eff}}`} is the effective field, ${tex`\alpha`} is the Gilbert damping, and ${tex`\gamma`} is the gyromagnetic ratio. ${tex`M_s`} is the saturation magnetisation of the material.
The effective field is the sum of the applied field ${tex`\mathbf{H}_{\text{app}}`}, the exchange field ${tex`\mathbf{H}_{\text{ex}}`}, the anisotropy field ${tex`\mathbf{H}_{\text{an}}`}, and the demagnetisation field ${tex`\mathbf{H}_{\text{demag}}`}. The effective field is given by:

```tex
\mathbf{H}_{\text{eff}} = \mathbf{H}_{\text{app}} + \mathbf{H}_{\text{ex}} + \mathbf{H}_{\text{an}} + \mathbf{H}_{\text{demag}}
```

The equation `(1)` has essentially two parts -- the precession term and the damping term. The precession term describes the tendency of the magnetisation to rotate about the axis of the effective field, while the damping term describes the tendency of the magnetisation to relax to its equilibrium state in the direction of the effective field. 

In the following sections, we will use a macrospin model, which assumes that the magnetisation is uniform throughout the material, and thus we will not consider spatial variations in the magnetisation. This simplification results in the rejection of the exchange field term. 

### What do we study? 

The study of the dynamics is naturally one of inspecting the magnetisation as a function of time, how do those components evolve in the presence of an external field, and how do different material or geometrical parameters affect said dynamics. 
Usually, we use the frequency spectrum of the magnetisation to study the dynamics, and we extract not only the natural frequencies but also harmonics. 

### Frequency spectrum

It turns out that we can excite the magnetisation with an injection of the current into a special ferromagnetic structure. Through an effect known as spin-transfer torque the polarised spin current passing through a ferromagnetic layer exerts a torque on the magnetisation. This torque drives the magnetisation into a precessional motion, and the frequency of this motion is the natural frequency of the magnetisation. We can thus expect that the frequency spectrum of the magnetisation will show a peak at the natural frequency of the magnetisation.

Let's see what happens if we apply a current to a trilayer stack (FM/NM/FM):

```js
const fftData = FileAttachment("./data/fft_oscillator.csv").csv({typed: true}).then(
    data => data.map(d => ({frequency: d.frequencies, amplitude: d.amplitudes, current_density: d.current_density/1e9}))
)
```

```js
fftplot(fftData, {height: 300, width: 600})
```

**Observations**: 
- The frequency peak wanders towards higher frequencies as the current density increases.
- The higher current density, the narrower the peak. That means an increase in the quality factor of the oscillator.
 
## Temperature 
The effect of temperature on the magnetisation is a difficult problem -- it's material dependent and the essence of the thermal fluctuations is naturally stochastic, which adds to the flair.


We usually solve the temperature dependent stochastic LLG equation to get the magnetisation dynamics -- and the form of that equation is called Stratonovich:
  
```tex
  X(t) = X(0) + \int_0^t f(X(s)) ds + \int_0^t g(X(s)) \circ dW(s)
```
with ${tex`X(t)`} being the stochastic process, ${tex`f(X(s))`} the deterministic part of the equation, ${tex`g(X(s))`} the stochastic part of the equation, and ${tex`dW(s)`} the Wiener process. ${tex`\circ`} denotes the Stratonovich integral.


And here's the stochastic LLG form of the equation:

```tex
\frac{d\mathbf{m}}{dt} = -\gamma \mathbf{m} \times \mathbf{H}_{\text{eff}} + \alpha \mathbf{m} \times \frac{d\mathbf{m}}{dt} + \sqrt{\frac{2\alpha k_B T}{\gamma \mu_0 M_s V}} \mathbf{m} \times \mathbf{R}(t)
```
where ${tex`\mathbf{m}`} is the magnetisation, ${tex`\mathbf{H}_{\mathrm{eff}}`} is the effective field, ${tex`\alpha`} is the Gilbert damping, ${tex`k_B`} is the Boltzmann constant, ${tex`T`} is the temperature, ${tex`\gamma`} is the gyromagnetic ratio, ${tex`\mu_0`} is the vacuum permeability, ${tex`M_s`} is the saturation magnetisation, ${tex`V`} is the volume of the magnet, and ${tex`R(t)`} is a white noise term, sampled from ${tex`\mathcal{N}(0, I)`}.



```js
const longitude = view(Inputs.range([-180, 180], {label: "Longitude", step: 1}));
const latitude = view(Inputs.range([-30, 30], {label: "Latitutde", step: 1}));
const temperature = view(Inputs.radio(["10K", "100K", "300K", "600K"], {label: "Temperature", value: "10K"}));

const filesValueMap = new Map([
    FileAttachment("./data/logTemp_10K.csv"),
    FileAttachment("./data/logTemp_100K.csv"),
    FileAttachment("./data/logTemp_300K.csv"),
    FileAttachment("./data/logTemp_600K.csv")
].map(
    // strip the temperature from the filename
    d => [d.name.split("_")[1].split(".")[0], d]
))
```
```js
const pointsSphere = filesValueMap.get(temperature).csv({typed: true}).then(
    // transform to a different spherical coords
    data => data.map(d => ({theta: 90 - d.theta, phi:  d.phi, color: colorScale(d.time/15e-9)})
))

const pointsLinear = filesValueMap.get(temperature).csv({typed: true}).then(
    // transform to a different spherical coords
    data => data.map(d => ({x: d.mx, y: d.my, z: d.mz, time: d.time*1e9, R: d.R, color: colorScale(d.time/15e-9)})
))
```
<div class="grid grid-cols-2">
  <div class="card">
    ${resize((width) => spherePlot(pointsSphere, longitude, latitude, {height: 300, width: width}))}
  </div>
  <div class="card">
    ${resize((width) => mplot(pointsLinear, {height: 300, width: width}))}
  </div>
</div>

The behaviour of the equilibrium magnetisation is governed by the Curie-Weiss law, which states that the magnetisation is proportional to the applied field and the temperature. The Curie-Weiss law is given by:

```tex
M = \frac{C}{T - \Theta}
```
where ${tex`M`} is the magnetisation, ${tex`C`} is the Curie constant, ${tex`T`} is the temperature, and ${tex`\Theta`} is the Curie temperature. The Curie temperature is the temperature at which a material loses its magnetic properties. For the purposes of studying the dynamics, the LLG equation is replaced with the LLGB equation, which includes the effect of finite temperature and models the behaviour near critical temperature $T_c$.

The equilibrium magnetisation is usually then solved with the mean field approximation, which through self-consistent iteration gives the stable magnetisation in function of temperature. 
```tex
m_e = \mathcal{L}(\beta J_0 m_e)
```
where ${tex`m_e`} is the equilibrium magnetisation, ${tex`\mathcal{L}`} is the Langevin function, ${tex`\beta = 1/(k_b T)`} is the inverse temperature, and ${tex`J_0`} is the exchange constant.

Langevin function is defined as:
```tex
\mathcal{L}(x) = \coth(x) - \frac{1}{x}
```

```js 
const mfa = FileAttachment("./data/mfa.csv").csv({typed: true}).then(
    data => data.map(d => ({Ts: d.Ts, me: d.me, J0: d.J0*1e20}))
);
```
```js
function mfaChart(data, {width}) {
  return Plot.plot({
    title: "Curie-Weiss MFA",
    width,
    height: 300,
    marginTop: 0,
    marginLeft: 50,
    x: {grid: true, label: "Temperature (K)"},
    y: {grid: true, label: "m_e"},
    color: {
      legend: true, type:"categorical", label: "Exchange constant (10^20 J/m^3)",
      scheme: "viridis", transform: d => "J0: " + parseInt(d) + " J/m^3"
    },    marks: [
      Plot.lineY(data, {x: "Ts", y: "me", stroke: "J0", tip: true}),
      Plot.ruleX([0])
    ]
  });
}
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => mfaChart(mfa, {width}))}
  </div>
