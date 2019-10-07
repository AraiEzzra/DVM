export const getDataSlice = (data: Buffer, offset: number, length: number): Buffer => {
    const start = Math.min(offset, data.length);
    const end = Math.min(start + length, data.length);
    const slice = data.slice(start, end);

    return bufferPadEnd(slice, length);
};

export const bufferPadEnd = (buffer: Buffer, length: number, byte: number = 0): Buffer => {
    return buffer.length === length
        ? buffer
        : Buffer.concat([buffer, Buffer.alloc(length - buffer.length, byte)], length);
};
