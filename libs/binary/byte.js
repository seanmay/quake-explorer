export const LITTLE_ENDIAN = true;
export const BIG_ENDIAN = false;

export const byteReader = (ArrayType, endianness = LITTLE_ENDIAN) => {
  const name = ArrayType.name.replace("Array", "");

  const single = (view, offset) =>
    view[`get${name}`](offset, endianness);

  const vector = (view, offset, count) => {
    let array = new ArrayType(count);
    for (let i = 0; i < count; i += 1) {
      const currentOffset = offset + i * ArrayType.BYTES_PER_ELEMENT;
      array[i] = single(view, currentOffset);
    }
    return array;
  };

  return {
    single,
    vector,
    BYTES_PER_ELEMENT: ArrayType.BYTES_PER_ELEMENT
  };
};
