import { Struct, string } from "/libs/binary/main.js";
import { u32, f32 } from "/libs/binary/little-endian.js";
import Vec3 from "/libs/pak/vec3.js";

const MDLHeader = Struct([
  ["kind",          string, 4],
  ["version",          u32, 1],
  ["scale",           Vec3, 1],
  ["origin",          Vec3, 1],
  ["radius",           f32, 1],
  ["offset",          Vec3, 1],
  ["skincount",        u32, 1],
  ["skinwidth",        u32, 1],
  ["skinheight",       u32, 1],
  ["vertexcount",      u32, 1],
  ["trianglecount",    u32, 1],
  ["framecount",       u32, 1],
  ["randomized",       u32, 1],
  ["flags",            u32, 1],
  ["size",             f32, 1],
]);

export default MDLHeader;
