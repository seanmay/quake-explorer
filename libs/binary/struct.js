export const Struct = (fields) => {
  const BYTES_PER_ELEMENT = fields
    .map(([, type, count]) => type.BYTES_PER_ELEMENT * count)
    .reduce((a, b) => a + b, 0);

  const single = (view, initialOffset) => {
    let offset = 0;
    let struct = { byteLength: 0 };
    for (let [name, type, count] of fields) {
      const currentOffset = initialOffset + offset;
      const value = count === 1
        ? type.single(view, currentOffset)
        : type.vector(view, currentOffset, count);
      
      struct[name] = value;
      offset += type.BYTES_PER_ELEMENT * count;
    }

    struct.byteLength = BYTES_PER_ELEMENT;
    return struct;
  };

  const vector = (view, initialOffset, count) => {
    let array = new Array(count);
    for (let i = 0; i < count; i += 1) {
      const currentOffset = initialOffset + i * BYTES_PER_ELEMENT;
      const value = single(view, currentOffset);
      array[i] = value;
    }
    return array;
  };

  return {
    single,
    vector,
    BYTES_PER_ELEMENT,
  };
};
