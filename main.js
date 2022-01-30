import { loadRawAssets } from "/libs/pak/pak-loader.js";
import { u8 } from "/libs/binary/little-endian.js";

// Add support for loading external "loose" assets *eventually*
const rawAssets = await loadRawAssets("/assets/id1");
console.log(rawAssets);

const paletteEntry = rawAssets.find(asset => asset.type === "palette");
const palette = u8.vector(paletteEntry.view, 0, paletteEntry.view.byteLength);
const colormapEntry = rawAssets.find(asset => asset.type === "colormap");
const colormap = u8.vector(colormapEntry.view, 0, colormapEntry.view.byteLength);

const paletteCanvas = document.createElement("canvas");
const paletteContext = paletteCanvas.getContext("2d");

paletteCanvas.width = 256;
paletteCanvas.height = 256;

const colormapCanvas = document.createElement("canvas");
const colormapContext = colormapCanvas.getContext("2d");

colormapCanvas.width = 256;
colormapCanvas.height = 256;

for (let y = 0; y < 16; y += 1) {
  for (let x = 0; x < 16; x += 1) {
    const index = (y * 16 + x) * 3;
    const r = palette[index + 0];
    const g = palette[index + 1];
    const b = palette[index + 2];

    paletteContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
    paletteContext.fillRect(x * 16, y * 16, 16, 16);
  }
}

const drawColormap = (page) => {
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) {
      const index = (y * 16 + x) + (page * 256);
      const r = palette[colormap[index] * 3 + 0];
      const g = palette[colormap[index] * 3 + 1];
      const b = palette[colormap[index] * 3 + 2];

      colormapContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
      colormapContext.fillRect(x * 16, y * 16, 16, 16);
    }
  }
};

const DEFAULT_BRIGHTNESS = 31;

const brightness = document.createElement("input");
const brightnessReset = document.createElement("button");

brightness.type = "range";
brightness.step = 1;
brightness.min = 0;
brightness.max = 63;
brightness.value = 31;
brightness.oninput = () => drawColormap(brightness.valueAsNumber);

brightnessReset.textContent = "reset";
brightnessReset.onclick = () => {
  brightness.value = DEFAULT_BRIGHTNESS;
  drawColormap(brightness.valueAsNumber);
};
drawColormap(brightness.valueAsNumber);
document.body.append(paletteCanvas, colormapCanvas, brightness, brightnessReset);

/*
  Layout
    -- load data
    -- parse data
    -- display data

*/


