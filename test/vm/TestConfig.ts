import { Config } from 'src/Config';
import { toBufferBE } from 'bigint-buffer';
import { generateAddress } from 'ethereumjs-util';
import { bigIntToBuffer } from 'src/interpreter/utils';

const bigIntToAddress = (b: bigint): Buffer => toBufferBE(b, 20);

const createAddress = (address: Buffer, nonce: bigint): Buffer => generateAddress(address, bigIntToBuffer(nonce));

export const testConfig: Config = {
    debug: true,
    bigIntToAddress,
    createAddress,
}
