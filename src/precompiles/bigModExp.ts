import { VM } from 'src/VM';
import { toBigIntBE, toBufferBE } from 'bigint-buffer';
import { IPrecompiledContract, Contract } from 'src/Contract';
import { getDataSlice, bitCount, expmod, bigMax } from 'src/interpreter/utils';

export const bigModExp: IPrecompiledContract = (vm: VM, contract: Contract, input: Buffer): Buffer => {

    let baseLenBigInt = toBigIntBE(getDataSlice(input, 0, 32));
    let expLenBigInt = toBigIntBE(getDataSlice(input, 32, 32));
    let modLenBigInt = toBigIntBE(getDataSlice(input, 64, 32));

    let baseLen = Number(baseLenBigInt);
    let expLen = Number(expLenBigInt);
    let modLen = Number(modLenBigInt);

    input = input.length > 96
        ? input.slice(96)
        : Buffer.alloc(0);

    const gas = requiredGas(baseLenBigInt, expLenBigInt, modLenBigInt, input) / vm.config.params.ModExpQuadCoeffDiv;

    contract.useGas(gas);

    if (baseLen === 0 && modLen === 0) {
        return Buffer.alloc(0);
    }

    const base = toBigIntBE(getDataSlice(input, 0, baseLen));
    const exp = toBigIntBE(getDataSlice(input, baseLen, expLen));
    const mod = toBigIntBE(getDataSlice(input, baseLen + expLen, modLen));

    if (bitCount(mod) === 0) {
        return Buffer.alloc(modLen);
    }

    const value = expmod(base, exp, mod);

    return toBufferBE(value, modLen);
};

export const requiredGas = (baseLen: bigint, expLen: bigint, modLen: bigint, input: Buffer): bigint => {
    let expHead: bigint;
    if (BigInt(input.length) <= baseLen) {
        expHead = 0n;
    } else {
        if (expLen > 32n) {
            expHead = toBigIntBE(getDataSlice(input, Number(baseLen), 32));
        } else {
            expHead = toBigIntBE(getDataSlice(input, Number(baseLen), Number(expLen)));
        }
    }

    let msb = 0;
    const bitlen = bitCount(expHead);
    if (bitlen > 0) {
        msb = bitlen - 1;        
    }

    let adjExpLen = 0n;

    if (expLen > 32n) {
        adjExpLen = expLen - 32n;
        adjExpLen = 8n * adjExpLen;
    }

    adjExpLen = adjExpLen + BigInt(msb);

    let gas = bigMax(modLen, baseLen);

    if (gas <= 64n) {
        gas = gas ** 2n;
    } else if (gas <= 1024n) {
        gas = ((gas ** 2n) / 4n) + (96n * gas) - 3072n;
    } else {
        gas = ((gas ** 2n) / 16n) + (480n * gas) - 199680n;
    }

    gas = gas * bigMax(adjExpLen, 1n);

    return gas;
};
