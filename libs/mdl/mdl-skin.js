import { Struct } from "/libs/binary/main.js";
import { u8, u32, f32 } from "/libs/binary/little-endian.js";

const SimpleSkin = (view, offset, size) => Struct([
  ["group", u32,    1],
  ["data",   u8, size],
]).single(view, offset);

const GroupSkin = (view, offset, size) => {
  const skincount = u32.single(view, offset + u32.BYTES_PER_ELEMENT);
  return Struct([
    ["group",     u32, 1               ],
    ["skincount", u32, 1               ],
    ["time",      f32, skincount       ],
    ["data",       u8, skincount * size],
  ]).single(view, offset);
};

const MDLSkin = {
  single: (view, offset, size) => {
    const group = u32.single(view, offset);
    return !group
      ? SimpleSkin(view, offset, size)
      : GroupSkin(view, offset, size);
  },
  vector: (view, offset, count, size) => {
    let skins = Array(count);
    let bytesRead = 0;
    for (let i = 0; i < count; i += 1) {
      const currentOffset = offset + bytesRead;
      const skin = MDLSkin.single(view, currentOffset, size);
      bytesRead += skin.byteLength;
      skins[i] = skin;
    }
    return skins;
  },
};

export default MDLSkin;
