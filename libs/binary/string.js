const readChar = (view, offset) => {
  const char = view.getUint8(offset);
  return char === 0
    ? ""
    : String.fromCharCode(char);
};

const readString = (view, offset, count) => {
  let str = "";
  for (let i = 0; i < count; i += 1) {
    const currentOffset = offset + i;
    const char = readChar(view, currentOffset);
    if (char === "")
      break;
    str += char;
  }
  return str;
};

export const string = {
  single: readChar,
  vector: readString,
  byteSize: Uint8Array.BYTES_PER_ELEMENT,
};

