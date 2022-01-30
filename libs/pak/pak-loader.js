import PakHeader from "./pak-header.js";
import PakEntry from "./pak-entry.js";


const loadBuffer = (path) =>
  fetch(path)
    .then(res => res.ok ? Promise.resolve(res) : Promise.reject(res))
    .then(res => res.arrayBuffer());


const loadPaks = async (path) => {
  let count = 0;
  let paks = [];

  while (true) {
    try {
      const buffer = await loadBuffer(`${path}/PAK${count}.PAK`);
      paks.push(new DataView(buffer));
      count += 1;
    } catch {
      break;
    }
  }

  return paks;
};

const extensionMap = {};

const getType = (name, extension) => {
  if (name === "colormap" || name === "palette") return name;
  const type = extensionMap[extension] ?? extension;
  return type;
};

const buildDataView = (pak, entry) => {
  const view = new DataView(pak, entry.offset, entry.size);
  const path = entry.path;
  const nameIndex = path.lastIndexOf("/") + 1;
  const extIndex = path.lastIndexOf(".") + 1;
  const name = path.substring(nameIndex, extIndex - 1);
  const extension = path.substring(extIndex);

  const type = getType(name, extension);
  return { path, name, extension, view, type };
};

export const loadRawAssets = async (path) => {
  const views = await loadPaks(path);

  const glossaries = views.map(view => {
    const header = PakHeader.single(view, 0);
    const entryCount = header.size / PakEntry.byteSize;
    const glossary = PakEntry.vector(view, header.offset, entryCount);
    return glossary;
  });

  const assets = glossaries.flatMap((entries, i) => {
    const view = views[i];
    return entries.map(entry => buildDataView(view.buffer, entry));
  }).sort(sortByTypeAndPath);

  return assets;
};

const identity = x => x;
const compare = (test, getValue = identity) => (a, b) => {
  const v1 = getValue(a);
  const v2 = getValue(b);

  return test(v1, v2) ? 1 : test(v2, v1) ? -1 : 0;
};

const subsort = (...comparisons) => (a, b) =>
  comparisons.reduce((x, compare) => x || compare(a, b), 0);

const getKey = (key) => (obj) => obj[key];
const not = (f) => (a, b) => !f(a, b);
const gt = (a, b) => a > b;
const lt = (a, b) => a < b;
const gte = not(lt);
const lte = not(gt);

const sortByType = compare(gt, getKey("type"));
const sortByPath = compare(gt, getKey("path"));
const sortByTypeAndPath = subsort(sortByType, sortByPath);
