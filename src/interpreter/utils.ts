import { toBufferBE } from 'bigint-buffer';

export const getDataSlice = (data: Buffer, offset: number, length: number): Buffer => {
    const start = Math.min(offset, data.length);
    const end = Math.min(start + length, data.length);
    const slice = data.slice(start, end);

    return bufferPadEnd(slice, length);
};

export const bufferPadEnd = (buffer: Buffer, length: number, byte: number = 0x00): Buffer => {
    return buffer.length === length
        ? buffer
        : Buffer.concat([buffer, Buffer.alloc(length - buffer.length, byte)], length);
};

// TODO
export const bigIntToBuffer = (value: bigint): Buffer => {
    if (value === 0n) {
        return Buffer.alloc(0);
    }
    let hex = value.toString(16);
    hex = hex.length % 2 === 0 ? hex : `0${hex}`;
    return Buffer.from(hex, 'hex');
};

// TODO
export const addressToBuffer = (address: bigint): Buffer => toBufferBE(address, 20);
