import { u32 } from "/libs/binary/little-endian.js";
import { Struct, string } from "/libs/binary/main.js";

const PakHeader = Struct([
  ["version", string, 4],
  ["offset",  u32,    1],
  ["size",    u32,    1],
]);

export default PakHeader;
