export const getDataSlice = (data: Buffer, offset: number, length: number): Buffer => {
    const start = Math.min(offset, data.length);
    const end = Math.min(start + length, data.length);
    const slice = data.slice(start, end);

    return Buffer.concat([slice, Buffer.alloc(length - slice.length)], length);
};
