export const Struct = (fields) => {
  const byteSize = fields
    .map(([, type, count]) => type.byteSize * count)
    .reduce((a, b) => a + b, 0);

  console.log(fields, byteSize);

  const single = (view, initialOffset) => {
    let offset = 0;
    let struct = { byteLength: 0 };
    for (let [name, type, count] of fields) {
      const currentOffset = initialOffset + offset;
      const value = count === 1
        ? type.single(view, currentOffset)
        : type.vector(view, currentOffset, count);
      
      struct[name] = value;
      offset += type.byteSize * count;
    }

    struct.byteLength = byteSize;
    return struct;
  };

  const vector = (view, initialOffset, count) => {
    let array = new Array(count);
    for (let i = 0; i < count; i += 1) {
      const currentOffset = initialOffset + i * byteSize;
      const value = single(view, currentOffset);
      array[i] = value;
    }
    return array;
  };

  return {
    single,
    vector,
    byteSize,
  };
};
