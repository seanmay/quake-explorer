import { BIG_ENDIAN, byteReader } from "./byte.js";

export const  u8 = byteReader(Uint8Array,   BIG_ENDIAN);
export const  i8 = byteReader(Int8Array,    BIG_ENDIAN);
export const u16 = byteReader(Uint16Array,  BIG_ENDIAN);
export const i16 = byteReader(Int16Array,   BIG_ENDIAN);
export const u32 = byteReader(Uint32Array,  BIG_ENDIAN);
export const i32 = byteReader(Int32Array,   BIG_ENDIAN);
export const f32 = byteReader(Float32Array, BIG_ENDIAN);
