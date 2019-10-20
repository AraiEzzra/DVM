import { toBufferBE } from 'bigint-buffer';
import { U256 } from 'src/interpreter/U256';
import { opCodeToHex } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';
import { GAS } from 'src/constants';

export const useGasZero = (state: State) => {};

export const useGasBase = (state: State) => state.eei.useGas(GAS.BaseGas);

export const useGasVeryLow = (state: State) => state.eei.useGas(GAS.VeryLowGas);

export const useGasLow = (state: State) => state.eei.useGas(GAS.LowGas);

export const useGasMid = (state: State) => state.eei.useGas(GAS.MidGas);

export const useGasHigh = (state: State) => state.eei.useGas(GAS.HighGas);

export const useGasExt = (state: State) => state.eei.useGas(GAS.ExtGas);

export const useGasExp = (state: State) => {
    const [base, exponent] = state.stack.peekN(2);
    const byteCount = U256.byteCount(exponent);

    state.eei.useGas(BigInt(byteCount) * GAS.ExpByteGas + GAS.ExpGas);
};

export const useGasSha3 = (state: State) => {
    const [offset, length] = state.stack.peekN(2);
    state.eei.useGas(GAS.Sha3Gas + GAS.Sha3WordGas * U256.divCeil(length));
    subMemUsage(state, offset, length);
};

export const useGasSload = (state: State) => state.eei.useGas(GAS.SloadGasFrontier);

export const useGasJumpdest = (state: State) => state.eei.useGas(GAS.JumpdestGas);

export const useGasBalance = (state: State) => state.eei.useGas(GAS.BalanceGasFrontier);

export const useGasSstore = (state: State) => {
    let [keyBE, valueBE] = state.stack.peekN(2);
    const key = toBufferBE(keyBE, 32);
    const value = valueBE === 0n
        ? Buffer.alloc(0)
        : toBufferBE(valueBE, 32);

    const currentValue = state.storage.getValue(state.eei.getAddress(), key);

    if (value.length === 0 && currentValue.length === 0) {
        state.eei.useGas(GAS.SstoreResetGas);
    } else if (value.length === 0 && currentValue.length !== 0) {
        state.eei.useGas(GAS.SstoreResetGas);
        // state.eei.refundGas()
    } else if (value.length !== 0 && currentValue.length === 0) {
        state.eei.useGas(GAS.SstoreSetGas);
    } else if (value.length !== 0 && currentValue.length !== 0) {
        state.eei.useGas(GAS.SstoreResetGas);
    }
};

export const useGasMload = (state: State) => {
    const [pos] = state.stack.peekN(1);
    state.eei.useGas(GAS.VeryLowGas);
    subMemUsage(state, pos, 32n);
};

export const useGasMstore = (state: State) => {
    let [offset, word] = state.stack.peekN(2);
    state.eei.useGas(GAS.VeryLowGas);
    subMemUsage(state, offset, 32n);
};

export const useGasMstore8 = (state: State) => {
    let [offset, word] = state.stack.peekN(2);
    state.eei.useGas(GAS.VeryLowGas);
    subMemUsage(state, offset, 1n);
};

export const useGasReturn = (state: State) => {
    let [offset, length] = state.stack.peekN(2);
    subMemUsage(state, offset, length);
};

export const useGasCodeCopy = (state: State) => {
    const [memOffset, codeOffset, length] = state.stack.peekN(3);
    subMemUsage(state, memOffset, length);

    state.eei.useGas(GAS.VeryLowGas + GAS.CopyGas * U256.divCeil(length));
};

export const useGasCallDataCopy = (state: State) => {
    const [memOffset, codeOffset, length] = state.stack.peekN(3);
    subMemUsage(state, memOffset, length);

    state.eei.useGas(GAS.VeryLowGas + GAS.CopyGas * U256.divCeil(length));
};

export const useGasLog = (state: State) => {
    const [memOffset, memLength] = state.stack.peekN(2);
    const topicsCount = state.opCode - 0xa0;

    subMemUsage(state, memOffset, memLength);

    state.eei.useGas(GAS.LogGas + GAS.LogTopicGas * BigInt(topicsCount) + memLength * GAS.LogDataGas);
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
    const cost = words * GAS.MemoryGas + words ** 2n / GAS.QuadCoeffDiv;

    if (cost > state.highestMemCost) {
        state.eei.useGas(cost - state.highestMemCost);
        state.highestMemCost = cost;
    }

    state.memoryWordCount = newMemoryWordCount;
};
