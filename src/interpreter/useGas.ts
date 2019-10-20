import { toBufferBE } from 'bigint-buffer';
import { U256 } from 'src/interpreter/U256';
import { opCodeToHex } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';

export const useGasZero = (state: State) => {};

export const useGasBase = (state: State) => state.contract.useGas(state.params.BaseGas);

export const useGasVeryLow = (state: State) => state.contract.useGas(state.params.VeryLowGas);

export const useGasLow = (state: State) => state.contract.useGas(state.params.LowGas);

export const useGasMid = (state: State) => state.contract.useGas(state.params.MidGas);

export const useGasHigh = (state: State) => state.contract.useGas(state.params.HighGas);

export const useGasExt = (state: State) => state.contract.useGas(state.params.ExtGas);

export const useGasExp = (state: State) => {
    const [base, exponent] = state.stack.peekN(2);
    const byteCount = U256.byteCount(exponent);
    const gas = BigInt(byteCount) * state.params.ExpByteGas + state.params.ExpGas;

    state.contract.useGas(gas);
};

export const useGasSha3 = (state: State) => {
    const [offset, length] = state.stack.peekN(2);
    state.contract.useGas(state.params.Sha3Gas + state.params.Sha3WordGas * U256.divCeil(length));
    subMemUsage(state, offset, length);
};

export const useGasSload = (state: State) => state.contract.useGas(state.params.SloadGas);

export const useGasJumpdest = (state: State) => state.contract.useGas(state.params.JumpdestGas);

export const useGasBalance = (state: State) => state.contract.useGas(state.params.BalanceGas);

export const useGasExtCodeSize = (state: State) => state.contract.useGas(state.params.ExtcodeSizeGas);

export const useGasSstore = (state: State) => {
    let [keyBE, valueBE] = state.stack.peekN(2);
    const key = toBufferBE(keyBE, 32);
    const value = valueBE === 0n
        ? Buffer.alloc(0)
        : toBufferBE(valueBE, 32);

    const currentValue = state.vm.storage.getValue(state.contract.address, key);

    state.contract.useGas(gasSStore(currentValue, value, state));
};

const gasSStore = (oldValue: Buffer, newValue: Buffer, state: State): bigint => {
    if (oldValue.length === 0 && newValue.length !== 0) {
        return state.params.SstoreSetGas;
    }        
    if (oldValue.length !== 0 && newValue.length === 0) {
        state.vm.storage.addRefund(state.params.SstoreRefundGas);
        return state.params.SstoreClearGas;
    }        
    return state.params.SstoreResetGas;
}

export const useGasMload = (state: State) => {
    const [pos] = state.stack.peekN(1);
    state.contract.useGas(state.params.VeryLowGas);
    subMemUsage(state, pos, 32n);
};

export const useGasMstore = (state: State) => {
    let [offset, word] = state.stack.peekN(2);
    state.contract.useGas(state.params.VeryLowGas);
    subMemUsage(state, offset, 32n);
};

export const useGasMstore8 = (state: State) => {
    let [offset, word] = state.stack.peekN(2);
    state.contract.useGas(state.params.VeryLowGas);
    subMemUsage(state, offset, 1n);
};

export const useGasReturn = (state: State) => {
    let [offset, length] = state.stack.peekN(2);
    subMemUsage(state, offset, length);
};

export const useGasCodeCopy = (state: State) => {
    const [memOffset, codeOffset, length] = state.stack.peekN(3);
    subMemUsage(state, memOffset, length);

    state.contract.useGas(state.params.VeryLowGas + state.params.CopyGas * U256.divCeil(length));
};

export const useGasCallDataCopy = (state: State) => {
    const [memOffset, codeOffset, length] = state.stack.peekN(3);
    subMemUsage(state, memOffset, length);

    state.contract.useGas(state.params.VeryLowGas + state.params.CopyGas * U256.divCeil(length));
};

export const useGasLog = (state: State) => {
    const [memOffset, memLength] = state.stack.peekN(2);
    const topicsCount = state.opCode - 0xa0;

    subMemUsage(state, memOffset, memLength);

    state.contract.useGas(state.params.LogGas + state.params.LogTopicGas * BigInt(topicsCount) + memLength * state.params.LogDataGas);
};

export const useGasExtCodeCopy = (state: State) => {
    let [address, memOffset, codeOffset, length] = state.stack.peekN(4);

    state.contract.useGas(state.params.ExtcodeCopyBase);

    subMemUsage(state, memOffset, length);

    state.contract.useGas(state.params.CopyGas * U256.divCeil(length));
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

    state.contract.useGas(state.params.CallGas);

    const toAddressBuf = state.vm.config.bigIntToAddress(toAddress);

    subMemUsage(state, inOffset, inLength);
    subMemUsage(state, outOffset, outLength);

    if (value !== 0n) {
        state.contract.useGas(state.params.CallValueTransferGas);
        if (!state.vm.storage.exist(toAddressBuf)) {
            state.contract.useGas(state.params.CallNewAccountGas);
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

    state.contract.useGas(state.params.CallGas);

    subMemUsage(state, inOffset, inLength);
    subMemUsage(state, outOffset, outLength);

    if (value !== 0n) {
        state.contract.useGas(state.params.CallValueTransferGas);
    }

    state.callGasTemp = maxCallGas(gasLimit, state.contract.gas);

    state.contract.useGas(state.callGasTemp);
};

export const useGasDelegateCall = (state: State) => {
    let [gasLimit, toAddress, inOffset, inLength, outOffset, outLength] = state.stack.peekN(6);

    state.contract.useGas(state.params.CallGas);

    subMemUsage(state, inOffset, inLength);
    subMemUsage(state, outOffset, outLength);

    state.callGasTemp = maxCallGas(gasLimit, state.contract.gas);

    state.contract.useGas(state.callGasTemp);
};

export const useGasCreate = (state: State) => {
    const [value, offset, length] = state.stack.peekN(3)

    state.contract.useGas(state.params.CreateGas);

    subMemUsage(state, offset, length);
};

export const useGasSuicide = (state: State) => {
    const [address] = state.stack.peekN(1);
    const addressBuf = state.vm.config.bigIntToAddress(address);
    const balance = state.vm.storage.getBalance(state.contract.address);
    let gas = state.params.SelfdestructGas;

    if (state.vm.storage.empty(addressBuf) && balance !== 0n) {
        gas += state.params.CreateBySelfdestructGas;
    }

    if (!state.vm.storage.hasSuicided(state.contract.address)) {
        state.vm.storage.addRefund(state.params.SelfdestructRefundGas);
    }

    state.contract.useGas(gas);   
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
    const cost = words * state.params.MemoryGas + words ** 2n / state.params.QuadCoeffDiv;

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
