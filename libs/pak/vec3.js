import { Struct } from "/libs/binary/main.js";
import { f32 } from "/libs/binary/little-endian.js";

const Vec3 = Struct([
  ["x", f32, 1],
  ["y", f32, 1],
  ["z", f32, 1],
]);

export default Vec3;
