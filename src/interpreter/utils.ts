import { toBufferBE } from 'bigint-buffer';

export const getDataSlice = (data: Buffer, offset: number, length: number): Buffer => {
    const start = Math.min(offset, data.length);
    const end = Math.min(start + length, data.length);
    const slice = data.slice(start, end);

    return bufferPadEnd(slice, length);
};

export const bufferPadEnd = (buffer: Buffer, length: number, byte: number = 0x00): Buffer => {
    if (buffer.length === length) {
        return buffer;
    }
    if (buffer.length > length) {
        return buffer.slice(0, length);
    }
    return Buffer.concat([buffer, Buffer.alloc(length - buffer.length, byte)], length);
};

export const bufferPadStart = (buffer: Buffer, length: number, byte: number = 0x00): Buffer => {
    if (buffer.length === length) {
        return buffer;
    }
    if (buffer.length > length) {
        return buffer.slice(0, length);
    }
    return Buffer.concat([Buffer.alloc(length - buffer.length, byte), buffer], length);
};

// TODO replace to toBufferBE
export const bigIntToBuffer = (value: bigint): Buffer => {
    if (value === 0n) {
        return Buffer.alloc(0);
    }
    let hex = value.toString(16);
    hex = hex.length % 2 === 0 ? hex : `0${hex}`;
    return Buffer.from(hex, 'hex');
};

export const bitCount = (value: bigint): number => {
    // TODO
    return value === 0n
        ? 0
        : value.toString(2).length;
};

export const byteCount = (value: bigint): number => {
    return Math.ceil(bitCount(value) / 8);
};

export const expmod = (base: bigint, exp: bigint, mod: bigint): bigint => {
    if (exp === 0n) {
        return 1n % mod;
    }
    const z = expmod(base, exp / 2n, mod);
    if (exp % 2n === 0n) {
        return (z * z) % mod;
    }
    return (base * z * z) % mod;
};

export const bigMax = (x: bigint, y: bigint): bigint => x > y ? x : y;
