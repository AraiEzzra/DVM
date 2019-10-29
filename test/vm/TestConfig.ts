import { Config } from 'src/Config';
import { toBufferBE } from 'bigint-buffer';
import { generateAddress, generateAddress2 } from 'ethereumjs-util';
import { bigIntToBuffer } from 'src/interpreter/utils';

const bigIntToAddress = (b: bigint): Buffer => toBufferBE(b, 20);

const createAddress = (address: Buffer, nonce: bigint): Buffer => {
    return generateAddress(address, bigIntToBuffer(nonce));
};

const createAddressWithSalt = (address: Buffer, salt: bigint, code: Buffer): Buffer => {
    return generateAddress2(address, toBufferBE(salt, 32), code);
};

const getBlockHash = (n: number): Buffer => { 
    throw new Error('getBlockHash not implemented');
};

export const testConfig: Config = {
    debug: true,
    bigIntToAddress,
    createAddress,
    createAddressWithSalt,
    getBlockHash
};
