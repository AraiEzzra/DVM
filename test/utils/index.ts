import { expect } from 'chai';
import * as rlp from 'rlp';
import { keccak256 } from 'src/interpreter/hash';
import { Log } from 'src/Log';

export const isBigIntEqual = (a: bigint, b: bigint) => {
    return expect(a === b, `0x${a.toString(16)} !== 0x${b.toString(16)}`).to.true;
};

export const isBufferEqual = (a: Buffer, b: Buffer) => {
    return expect(a.toString('hex') === b.toString('hex'), `0x${a.toString('hex')} !== 0x${b.toString('hex')}`).to.true;
};

export const hexToBigInt = (value: string): bigint => {
    if (value === undefined || value === '0x') {
        return 0n;
    }
    return BigInt(value);
};

export const hexToBuffer = (value: string, size: number = 0): Buffer => {
    if (size === 0) {
        if (value === undefined) {
            return Buffer.alloc(0);
        }
        return Buffer.from(stripHexPrefix(value), 'hex');
    }

    const buffer = Buffer.alloc(size);
    const hex = stripHexPrefix(value).padStart(2 * size, '0');
    buffer.write(hex, 'hex');

    return buffer;
};

export const stripHexPrefix = (value: string) => value.startsWith('0x') ? value.slice(2) : value;

export const logsToHash = (logs: Array<Log>): Buffer => {
    const value = logs.map(item => Object.values(item));
    return keccak256(rlp.encode(value));
};
