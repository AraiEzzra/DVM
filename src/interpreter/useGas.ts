import { toBufferBE } from 'bigint-buffer';
import { U256 } from 'src/interpreter/U256';
import { opCodeToHex } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';
import { PARAMS } from 'src/constants';
import { addressToBuffer } from 'src/interpreter/utils';

export const useGasZero = (state: State) => {};

export const useGasBase = (state: State) => state.contract.useGas(PARAMS.BaseGas);

export const useGasVeryLow = (state: State) => state.contract.useGas(PARAMS.VeryLowGas);

export const useGasLow = (state: State) => state.contract.useGas(PARAMS.LowGas);

export const useGasMid = (state: State) => state.contract.useGas(PARAMS.MidGas);

export const useGasHigh = (state: State) => state.contract.useGas(PARAMS.HighGas);

export const useGasExt = (state: State) => state.contract.useGas(PARAMS.ExtGas);

export const useGasExp = (state: State) => {
    const [base, exponent] = state.stack.peekN(2);
    const byteCount = U256.byteCount(exponent);
    state.contract.useGas(BigInt(byteCount) * PARAMS.ExpByteGas + PARAMS.ExpGas);
};

export const useGasSha3 = (state: State) => {
    const [offset, length] = state.stack.peekN(2);
    state.contract.useGas(PARAMS.Sha3Gas + PARAMS.Sha3WordGas * U256.divCeil(length));
    subMemUsage(state, offset, length);
};

export const useGasSload = (state: State) => state.contract.useGas(PARAMS.SloadGas);

export const useGasJumpdest = (state: State) => state.contract.useGas(PARAMS.JumpdestGas);

export const useGasBalance = (state: State) => state.contract.useGas(PARAMS.BalanceGas);

export const useGasExtCodeSize = (state: State) => state.contract.useGas(PARAMS.ExtcodeSizeGas);

export const useGasSstore = (state: State) => {
    let [keyBE, valueBE] = state.stack.peekN(2);
    const key = toBufferBE(keyBE, 32);
    const value = valueBE === 0n
        ? Buffer.alloc(0)
        : toBufferBE(valueBE, 32);

    const currentValue = state.vm.storage.getValue(state.contract.address, key);

    if (value.length === 0 && currentValue.length === 0) {
        state.contract.useGas(PARAMS.SstoreResetGas);
    } else if (value.length === 0 && currentValue.length !== 0) {
        state.contract.useGas(PARAMS.SstoreResetGas);
        // state.contract.refundGas()
    } else if (value.length !== 0 && currentValue.length === 0) {
        state.contract.useGas(PARAMS.SstoreSetGas);
    } else if (value.length !== 0 && currentValue.length !== 0) {
        state.contract.useGas(PARAMS.SstoreResetGas);
    }
};

export const useGasMload = (state: State) => {
    const [pos] = state.stack.peekN(1);
    state.contract.useGas(PARAMS.VeryLowGas);
    subMemUsage(state, pos, 32n);
};

export const useGasMstore = (state: State) => {
    let [offset, word] = state.stack.peekN(2);
    state.contract.useGas(PARAMS.VeryLowGas);
    subMemUsage(state, offset, 32n);
};

export const useGasMstore8 = (state: State) => {
    let [offset, word] = state.stack.peekN(2);
    state.contract.useGas(PARAMS.VeryLowGas);
    subMemUsage(state, offset, 1n);
};

export const useGasReturn = (state: State) => {
    let [offset, length] = state.stack.peekN(2);
    subMemUsage(state, offset, length);
};

export const useGasCodeCopy = (state: State) => {
    const [memOffset, codeOffset, length] = state.stack.peekN(3);
    subMemUsage(state, memOffset, length);

    state.contract.useGas(PARAMS.VeryLowGas + PARAMS.CopyGas * U256.divCeil(length));
};

export const useGasCallDataCopy = (state: State) => {
    const [memOffset, codeOffset, length] = state.stack.peekN(3);
    subMemUsage(state, memOffset, length);

    state.contract.useGas(PARAMS.VeryLowGas + PARAMS.CopyGas * U256.divCeil(length));
};

export const useGasLog = (state: State) => {
    const [memOffset, memLength] = state.stack.peekN(2);
    const topicsCount = state.opCode - 0xa0;

    subMemUsage(state, memOffset, memLength);

    state.contract.useGas(PARAMS.LogGas + PARAMS.LogTopicGas * BigInt(topicsCount) + memLength * PARAMS.LogDataGas);
};

export const useGasCall = (state: State) => {
    const [
        gasLimit,
        toAddress,
        value,
        inOffset,
        inLength,
        outOffset,
        outLength,
    ] = state.stack.peekN(7);

    state.contract.useGas(PARAMS.CallGas);

    const toAddressBuf = addressToBuffer(toAddress);

    subMemUsage(state, inOffset, inLength);
    subMemUsage(state, outOffset, outLength);

    if (value !== 0n) {
        state.contract.useGas(PARAMS.CallValueTransferGas);
        if (!state.vm.storage.exist(toAddressBuf)) {
            state.contract.useGas(PARAMS.CallNewAccountGas);
        }
    }

    state.callGasTemp = maxCallGas(gasLimit, state.contract.gas);

    state.contract.useGas(state.callGasTemp);
};

export const useGasCallCode = (state: State) => {
    const [
        gasLimit,
        toAddress,
        value,
        inOffset,
        inLength,
        outOffset,
        outLength,
    ] = state.stack.peekN(7);

    state.contract.useGas(PARAMS.CallGas);

    subMemUsage(state, inOffset, inLength);
    subMemUsage(state, outOffset, outLength);

    if (value !== 0n) {
        state.contract.useGas(PARAMS.CallValueTransferGas);
    }

    state.callGasTemp = maxCallGas(gasLimit, state.contract.gas);

    state.contract.useGas(state.callGasTemp);
};

export const useGasSuicide = (state: State) => {
};

export const useGasInvalid = (state: State) => {
    throw new Error(`GasInvalid ${opCodeToHex(state.opCode)}`);
};

// TODO
export const subMemUsage = (state: State, offset: bigint, length: bigint) => {
    if (length === 0n) {
        return;
    }

    const newMemoryWordCount = U256.divCeil(offset + length);

    if (newMemoryWordCount < state.memoryWordCount) {
        return;
    }

    const words = newMemoryWordCount;
    const cost = words * PARAMS.MemoryGas + words ** 2n / PARAMS.QuadCoeffDiv;

    if (cost > state.highestMemCost) {
        state.contract.useGas(cost - state.highestMemCost);
        state.highestMemCost = cost;
    }

    state.memoryWordCount = newMemoryWordCount;
};

export const maxCallGas = (gasLimit: bigint, gasLeft: bigint): bigint => {
    const gasAllowed = gasLeft - (gasLeft % 64n);
    return gasLimit > gasAllowed ? gasAllowed : gasLimit;
};
