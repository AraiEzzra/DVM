import { toBufferBE } from 'bigint-buffer';
import { U256 } from 'src/interpreter/U256';
import { opCodeToHex } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';
import { byteCount } from 'src/interpreter/utils';

export const useGasZero = (state: State) => {};

export const useGasBase = (state: State) => state.contract.useGas(state.params.BaseGas);

export const useGasVeryLow = (state: State) => state.contract.useGas(state.params.VeryLowGas);

export const useGasLow = (state: State) => state.contract.useGas(state.params.LowGas);

export const useGasMid = (state: State) => state.contract.useGas(state.params.MidGas);

export const useGasHigh = (state: State) => state.contract.useGas(state.params.HighGas);

export const useGasExt = (state: State) => state.contract.useGas(state.params.ExtGas);

export const useGasExp = (state: State) => {
    const exponent = state.stack.back(1);
    const count = byteCount(exponent);
    const gas = BigInt(count) * state.params.ExpByteGas + state.params.ExpGas;

    state.contract.useGas(gas);
};

export const useGasReturnDataCopy = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(2);

    let gas = state.params.VeryLowGas + state.params.CopyGas * U256.divCeil(length);

    gas += memoryGasCost(state, offset, length);

    state.contract.useGas(gas);
};

export const useGasSha3 = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(1);

    let gas = state.params.Sha3Gas + state.params.Sha3WordGas * U256.divCeil(length);

    gas += memoryGasCost(state, offset, length);

    state.contract.useGas(gas);
};

export const useGasSload = (state: State) => state.contract.useGas(state.params.SloadGas);

export const useGasJumpdest = (state: State) => state.contract.useGas(state.params.JumpdestGas);

export const useGasBalance = (state: State) => state.contract.useGas(state.params.BalanceGas);

export const useGasExtCodeSize = (state: State) => state.contract.useGas(state.params.ExtcodeSizeGas);

export const useGasSstore = (state: State) => {
    const key = toBufferBE(state.stack.back(0), 32);
    const valueBE = state.stack.back(1);

    const value = valueBE === 0n
        ? Buffer.alloc(0)
        : toBufferBE(valueBE, 32);

    const currentValue = state.vm.storage.getValue(state.contract.address, key);

    let gas = gasSStore(currentValue, value, state);

    state.contract.useGas(gas);
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
};

export const useGasMload = (state: State) => {
    const offset = state.stack.back(0);

    let gas = state.params.VeryLowGas;

    gas += memoryGasCost(state, offset, 32n);

    state.contract.useGas(gas);
};

export const useGasMstore = (state: State) => {
    const offset = state.stack.back(0);

    let gas = state.params.VeryLowGas;

    gas += memoryGasCost(state, offset, 32n);

    state.contract.useGas(gas);
};

export const useGasMstore8 = (state: State) => {
    const offset = state.stack.back(0);

    let gas = state.params.VeryLowGas;

    gas += memoryGasCost(state, offset, 1n);

    state.contract.useGas(gas);
};

export const useGasReturn = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(1);

    let gas = memoryGasCost(state, offset, length);

    state.contract.useGas(gas);
};

export const useGasCodeCopy = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(2);

    let gas = state.params.VeryLowGas + state.params.CopyGas * U256.divCeil(length);

    gas += memoryGasCost(state, offset, length);

    state.contract.useGas(gas);
};

export const useGasCallDataCopy = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(2);

    let gas = state.params.VeryLowGas + state.params.CopyGas * U256.divCeil(length);

    gas += memoryGasCost(state, offset, length);

    state.contract.useGas(gas);
};

export const useGasLog = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(1);
    const topicsCount = state.opCode - 0xa0;

    let gas = state.params.LogGas + state.params.LogTopicGas * BigInt(topicsCount) + length * state.params.LogDataGas;

    gas += memoryGasCost(state, offset, length);

    state.contract.useGas(gas);
};

export const useGasExtCodeCopy = (state: State) => {
    const offset = state.stack.back(1);
    const length = state.stack.back(3);

    let gas = state.params.ExtcodeCopyBase;

    gas += memoryGasCost(state, offset, length);
    gas += state.params.CopyGas * U256.divCeil(length);

    state.contract.useGas(gas);
};

export const useGasCall = (state: State) => {
    const gasLimit = state.stack.back(0);
    const address = state.vm.config.bigIntToAddress(state.stack.back(1));
    const value = state.stack.back(2);
    const inOffset = state.stack.back(3);
    const inLength = state.stack.back(4);
    const outOffset = state.stack.back(5);
    const outLength = state.stack.back(6);

    let gas = state.params.CallGas;

    gas += memoryGasCost(state, inOffset, inLength);
    gas += memoryGasCost(state, outOffset, outLength);

    if (value !== 0n) {
        gas += state.params.CallValueTransferGas;
        if (state.vm.storage.empty(address)) {
            gas += state.params.CallNewAccountGas;
        }
    }

    state.callGasTemp = callGas(state.contract.gas, gas, gasLimit);

    gas += state.callGasTemp;

    state.contract.useGas(gas);
};

export const useGasCallCode = (state: State) => {
    const gasLimit = state.stack.back(0);
    const value = state.stack.back(2);
    const inOffset = state.stack.back(3);
    const inLength = state.stack.back(4);
    const outOffset = state.stack.back(5);
    const outLength = state.stack.back(6);

    let gas = state.params.CallGas;

    gas += memoryGasCost(state, inOffset, inLength);
    gas += memoryGasCost(state, outOffset, outLength);

    if (value !== 0n) {
        gas += state.params.CallValueTransferGas;
    }

    state.callGasTemp = callGas(state.contract.gas, gas, gasLimit);

    gas += state.callGasTemp;

    state.contract.useGas(gas);
};

export const useGasDelegateCall = (state: State) => {
    const gasLimit = state.stack.back(0);
    const inOffset = state.stack.back(2);
    const inLength = state.stack.back(3);
    const outOffset = state.stack.back(4);
    const outLength = state.stack.back(5);

    let gas = state.params.CallGas;

    gas += memoryGasCost(state, inOffset, inLength);
    gas += memoryGasCost(state, outOffset, outLength);

    state.callGasTemp = callGas(state.contract.gas, gas, gasLimit);

    gas += state.callGasTemp;

    state.contract.useGas(gas);
};

export const useGasStaticCall = (state: State) => {
    const gasLimit = state.stack.back(0);
    const inOffset = state.stack.back(2);
    const inLength = state.stack.back(3);
    const outOffset = state.stack.back(4);
    const outLength = state.stack.back(5);

    let gas = state.params.CallGas;

    gas += memoryGasCost(state, inOffset, inLength);
    gas += memoryGasCost(state, outOffset, outLength);

    state.callGasTemp = callGas(state.contract.gas, gas, gasLimit);

    gas += state.callGasTemp;

    state.contract.useGas(gas);
};

export const useGasCreate = (state: State) => {
    const offset = state.stack.back(1);
    const length = state.stack.back(2);

    let gas = state.params.CreateGas;

    gas += memoryGasCost(state, offset, length);

    state.contract.useGas(gas);
};

export const useGasCreate2 = (state: State) => {
    const offset = state.stack.back(1);
    const length = state.stack.back(2);

    let gas = state.params.Create2Gas;

    gas += memoryGasCost(state, offset, length);
    gas += state.params.Sha3WordGas * U256.divCeil(length);

    state.contract.useGas(gas);
};

export const useGasSuicide = (state: State) => {
    const address = state.vm.config.bigIntToAddress(state.stack.back(0));
    const balance = state.vm.storage.getBalance(state.contract.address);
    let gas = state.params.SelfdestructGas;

    if (state.vm.storage.empty(address) && balance !== 0n) {
        gas += state.params.CreateBySelfdestructGas;
    }

    if (!state.vm.storage.hasSuicided(state.contract.address)) {
        state.vm.storage.addRefund(state.params.SelfdestructRefundGas);
    }

    state.contract.useGas(gas);
};

export const useGasRevert = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(1);

    let gas = memoryGasCost(state, offset, length);

    state.contract.useGas(gas);
};

export const useGasExtCodeHash = (state: State) => state.contract.useGas(state.params.ExtcodeHashGas);

export const useGasInvalid = (state: State) => {
    throw new Error(`GasInvalid ${opCodeToHex(state.opCode)}`);
};

export const memoryGasCost = (state: State, offset: bigint, length: bigint) => {
    if (length === 0n) {
        return 0n;
    }

    const newMemoryWordCount = U256.divCeil(offset + length);

    if (newMemoryWordCount < state.memoryWordCount) {
        return 0n;
    }

    const words = newMemoryWordCount;
    const cost = words * state.params.MemoryGas + words ** 2n / state.params.QuadCoeffDiv;

    let gas = 0n;

    if (cost > state.highestMemCost) {
        gas = cost - state.highestMemCost;
        state.highestMemCost = cost;
    }

    state.memoryWordCount = newMemoryWordCount;

    return gas;
};

export const callGas = (availableGas: bigint, base: bigint, callCost: bigint): bigint => {
    availableGas = availableGas - base;
    const gas = availableGas - availableGas / 64n;
    if (gas < callCost) {
        return gas;
    }
    return callCost;
};
