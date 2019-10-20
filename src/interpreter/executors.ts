import { toBigIntBE, toBufferBE } from 'bigint-buffer';
import { dupPosition, pushBytes, swapPosition, logBytes } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';
import { VmError, ERROR, ExecutionRevertedError, isExecutionReverted } from 'src/exceptions';
import { U256 } from 'src/interpreter/U256';
import { keccak256 } from 'src/interpreter/hash';
import { getDataSlice, bigIntToBuffer } from 'src/interpreter/utils';

export const opInvalid = (state: State) => {
    throw new VmError(ERROR.INVALID_OPCODE(state.opCode));
};

export const opStop = (state: State) => {};

export const opAdd = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = U256.asUint(a + b);
    state.stack.push(result);
};

export const opMul = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = U256.asUint(a * b);
    state.stack.push(result);
};

export const opSub = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = U256.asUint(a - b);
    state.stack.push(result);
};

export const opDiv = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = b === 0n
        ? 0n
        : U256.asUint(a / b);
    state.stack.push(result);
};

export const opSdiv = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = b === 0n
        ? 0n
        : U256.asUint(U256.asInt(a) / U256.asInt(b));
    state.stack.push(result);
};

export const opMod = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = b === 0n
        ? 0n
        : U256.asUint(a % b);
    state.stack.push(result);
};

export const opSmod = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = b === 0n
        ? 0n
        : U256.asUint(U256.asInt(a) % U256.asInt(b));
    state.stack.push(result);
};

export const opAddmod = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    const c = state.stack.pop();

    const result = c === 0n
        ? 0n
        : U256.asUint((a + b) % c);

    state.stack.push(result);
};

export const opMulmod = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    const c = state.stack.pop();

    const result = c === 0n
        ? 0n
        : U256.asUint((a * b) % c);

    state.stack.push(result);
};

export const opExp = (state: State) => {
    const base = state.stack.pop();
    const exponent = state.stack.pop();

    const result = U256.expmod(base, exponent);
    state.stack.push(result);
};

export const opSignExtend = (state: State) => {
    const k = state.stack.pop();
    const value = state.stack.pop();

    if (k < 31n) {
        const bit = k * 8n + 7n;
        const mask = (1n << bit) - 1n;

        const result = U256.bit(value, bit) === 1n
            ? value | (~mask)
            : value & mask;

        state.stack.push(U256.asUint(result));
        return;
    }

    state.stack.push(value);
};

export const opLt = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = a < b ? 1n : 0n;
    state.stack.push(result);
};

export const opGt = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = a > b ? 1n : 0n;
    state.stack.push(result);
};

export const opSlt = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = U256.asInt(a) < U256.asInt(b) ? 1n : 0n;
    state.stack.push(result);
};

export const opSgt = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = U256.asInt(a) > U256.asInt(b) ? 1n : 0n;
    state.stack.push(result);
};

export const opEq = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = a === b ? 1n : 0n;
    state.stack.push(result);
};

export const opIszero = (state: State) => {
    const a = state.stack.pop();
    const result = a === 0n ? 1n : 0n;
    state.stack.push(result);
};

export const opAnd = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = a & b;
    state.stack.push(result);
};

export const opOr = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = a | b;
    state.stack.push(result);
};

export const opXor = (state: State) => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = a ^ b;
    state.stack.push(result);
};

export const opNot = (state: State) => {
    const a = state.stack.pop();
    const result = U256.asUint(~a);
    state.stack.push(result);
};

export const opByte = (state: State) => {
    const pos = state.stack.pop();
    const word = state.stack.pop();

    const result = pos < 32n
        ? (word >> (248n - pos * 8n)) & U256.BYTE
        : 0n;

    state.stack.push(result);
};

export const opSHL = (state: State) => {
    const shift = state.stack.pop();
    const value = state.stack.pop();

    const result = shift < 256n
        ? U256.asUint(value << shift)
        : 0n;

    state.stack.push(result);
};

export const opSHR = (state: State) => {
    const shift = state.stack.pop();
    const value = state.stack.pop();

    const result = shift < 256n
        ? U256.asUint(value >> shift)
        : 0n;

    state.stack.push(result);
};

export const opSAR = (state: State) => {
    const shift = state.stack.pop();
    const value = state.stack.pop();

    if (shift < 256n) {
        const result = U256.asUint(U256.asInt(value) >> shift);
        state.stack.push(result);
    } else {
        const isSigned = U256.asInt(value) >= 0;
        const result = U256.asUint(isSigned ? 0n : -1n);
        state.stack.push(result);
    }
};

export const opSha3 = (state: State) => {
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const data = state.memory.get(offset, length);
    const result = toBigIntBE(keccak256(data));

    state.stack.push(result);
};

export const opPush = (state: State) => {
    const numToPush = pushBytes(state.opCode);

    const value = state.contract.code
        .slice(state.programCounter, state.programCounter + numToPush);

    state.programCounter += numToPush;
    state.stack.push(toBigIntBE(value));
};

export const opDup = (state: State) => {
    const stackPos = dupPosition(state.opCode);
    state.stack.dup(stackPos);
};

export const opSwap = (state: State) => {
    const stackPos = swapPosition(state.opCode);
    state.stack.swap(stackPos);
};

export const opSload = (state: State) => {
    const key = toBufferBE(state.stack.pop(), 32);
    const value = state.vm.storage.getValue(state.contract.address, key);

    state.stack.push(toBigIntBE(value));
};

export const opSstore = (state: State) => {
    const key = toBufferBE(state.stack.pop(), 32);
    const value = bigIntToBuffer(state.stack.pop());

    state.vm.emit('sstore', [
        state.contract.address.toString('hex'),
        key.toString('hex'),
        value.toString('hex')
    ]);

    state.vm.storage.setValue(state.contract.address, key, value);
};

export const opJumpdest = (state: State) => {};

export const opJump = (state: State) => {
    const dest = Number(state.stack.pop());

    if (!state.isJumpValid(dest)) {
        throw new VmError(ERROR.INVALID_JUMP);
    }

    state.programCounter = dest;
};

export const opJumpi = (state: State) => {
    const dest = Number(state.stack.pop());
    const cond = Number(state.stack.pop());
   
    if (cond !== 0) {
        if (!state.isJumpValid(dest)) {
            throw new VmError(ERROR.INVALID_JUMP);
        }
    
        state.programCounter = dest;
    }
};

export const opCallDataLoad = (state: State) => {
    const offset = Number(state.stack.pop());
    const data = getDataSlice(state.contract.input, offset, 32);

    state.stack.push(toBigIntBE(data));
};

export const opCallValue = (state: State) => {
    state.stack.push(state.contract.value);
};

export const opNumber = (state: State) => {
    state.stack.push(state.vm.context.blockNumber);
};

export const opTimestamp = (state: State) => {
    state.stack.push(state.vm.context.time);
};

export const opCoinbase = (state: State) => {
    state.stack.push(toBigIntBE(state.vm.context.coinbase));
};

export const opDifficulty = (state: State) => {
    state.stack.push(state.vm.context.difficulty);
};

export const opGasLimit = (state: State) => {
    state.stack.push(state.vm.context.gasLimit);
};

export const opPop = (state: State) => {
    state.stack.pop();
};

export const opPc = (state: State) => {
    state.stack.push(BigInt(state.programCounter - 1));
};

export const opMload = (state: State) => {
    const offset = Number(state.stack.pop());
    const value = state.memory.get(offset, 32);

    state.stack.push(toBigIntBE(value));
};

export const opMstore = (state: State) => {
    const offset = Number(state.stack.pop());
    const value = toBufferBE(state.stack.pop(), 32);

    state.memory.set(offset, 32, value);
};

export const opMstore8 = (state: State) => {
    const offset = Number(state.stack.pop());
    const value = toBufferBE(state.stack.pop() & U256.BYTE, 1);

    state.memory.set(offset, 1, value);
};

export const opMsize = (state: State) => {
    // TODO
    state.stack.push(state.memoryWordCount * 32n);
};

export const opReturn = (state: State) => {
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const value = state.memory.get(offset, length);
    state.returnData = value;
};

export const opGas = (state: State) => {
    state.stack.push(state.contract.gas);
};

export const opCaller = (state: State) => {
    state.stack.push(toBigIntBE(state.contract.callerAddress));
};

export const opCodeCopy = (state: State) => {
    const memOffset = Number(state.stack.pop());
    const codeOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const data = getDataSlice(state.contract.code, codeOffset, length);
    state.memory.set(memOffset, length, data);
};

export const opAddress = (state: State) => {
    state.stack.push(toBigIntBE(state.contract.address));
};

export const opCallDataCopy = (state: State) => {
    const memOffset = Number(state.stack.pop());
    const codeOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const data = getDataSlice(state.contract.input, codeOffset, length);
    state.memory.set(memOffset, length, data);
};

export const opCallDataSize = (state: State) => {
    const value = BigInt(state.contract.input.length);
    state.stack.push(value);
};

export const opCodeSize = (state: State) => {
    const value = BigInt(state.contract.code.length);
    state.stack.push(value);
};

export const opGasprice = (state: State) => {
    state.stack.push(state.vm.context.gasPrice);
};

export const opOrigin = (state: State) => {
    state.stack.push(toBigIntBE(state.vm.context.origin));
};

export const opLog = (state: State) => {
    const memOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());
    const topicsCount = logBytes(state.opCode);
    const topics: Array<Buffer> = [];

    for (let i = 0; i < topicsCount ; i++) {
        topics.push(toBufferBE(state.stack.pop(), 32));
    }

    const data = state.memory.get(memOffset, length);

    state.vm.storage.addLog({
        address: state.contract.address,
        topics,
        data
    });
};

export const opSuicide = (state: State) => {
    const address = state.stack.pop();
    const balance = state.vm.storage.getBalance(state.contract.address);
    state.vm.storage.addBalance(state.vm.config.bigIntToAddress(address), balance);

    state.vm.storage.suicide(state.contract.address);
};

export const opBalance = (state: State) => {
    const address = state.stack.pop();
    const value = state.vm.storage.getBalance(state.vm.config.bigIntToAddress(address));

    state.stack.push(value);
};

export const opCall = async (state: State) => {
    const gasLimit = Number(state.stack.pop());
    const address = state.vm.config.bigIntToAddress(state.stack.pop());
    const value = state.stack.pop();
    const inOffset = Number(state.stack.pop());
    const inLength = Number(state.stack.pop());
    const outOffset = Number(state.stack.pop());
    const outLength = Number(state.stack.pop());

    let gas = state.callGasTemp;

    const data = state.memory.get(inOffset, inLength);

    if (value !== 0n) {
        gas += state.params.CallStipend;
    }

    const { returnData, leftOverGas, error } = await state.vm.call(state.contract, address, data, gas, value);

    state.stack.push(error ? 0n : 1n);

    if (!error || isExecutionReverted(error)) {
        const memoryData = getDataSlice(returnData, 0, outLength);
        state.memory.set(outOffset, outLength, memoryData);
    }

    state.returnData = returnData;
    state.contract.gas += leftOverGas;
};

export const opCallCode = async (state: State) => {
    const gasLimit = Number(state.stack.pop());
    const address = state.vm.config.bigIntToAddress(state.stack.pop());
    const value = state.stack.pop();
    const inOffset = Number(state.stack.pop());
    const inLength = Number(state.stack.pop());
    const outOffset = Number(state.stack.pop());
    const outLength = Number(state.stack.pop());

    let gas = state.callGasTemp;

    const data = state.memory.get(inOffset, inLength);

    if (value !== 0n) {
        gas += state.params.CallStipend;
    }

    const { returnData, leftOverGas, error } = await state.vm.callCode(state.contract, address, data, gas, value);

    state.stack.push(error ? 0n : 1n);

    if (!error || isExecutionReverted(error)) {
        const memoryData = getDataSlice(returnData, 0, outLength);
        state.memory.set(outOffset, outLength, memoryData);
    }

    state.returnData = returnData;
    state.contract.gas += leftOverGas;
};

export const opDelegateCall = async (state: State) => {
    const gasLimit = Number(state.stack.pop());
    const address = state.vm.config.bigIntToAddress(state.stack.pop());
    const inOffset = Number(state.stack.pop());
    const inLength = Number(state.stack.pop());
    const outOffset = Number(state.stack.pop());
    const outLength = Number(state.stack.pop());

    let gas = state.callGasTemp;

    const data = state.memory.get(inOffset, inLength);

    const { returnData, leftOverGas, error } = await state.vm.delegateCall(state.contract, address, data, gas);

    state.stack.push(error ? 0n : 1n);

    if (!error || isExecutionReverted(error)) {
        const memoryData = getDataSlice(returnData, 0, outLength);
        state.memory.set(outOffset, outLength, memoryData);
    }

    state.returnData = returnData;
    state.contract.gas += leftOverGas;
};

export const opStaticCall = async (state: State) => {
    const gasLimit = Number(state.stack.pop());
    const address = state.vm.config.bigIntToAddress(state.stack.pop());
    const inOffset = Number(state.stack.pop());
    const inLength = Number(state.stack.pop());
    const outOffset = Number(state.stack.pop());
    const outLength = Number(state.stack.pop());

    let gas = state.callGasTemp;

    const data = state.memory.get(inOffset, inLength);

    const { returnData, leftOverGas, error } = await state.vm.staticCall(state.contract, address, data, gas);

    state.stack.push(error ? 0n : 1n);

    if (!error || isExecutionReverted(error)) {
        const memoryData = getDataSlice(returnData, 0, outLength);
        state.memory.set(outOffset, outLength, memoryData);
    }

    state.returnData = returnData;
    state.contract.gas += leftOverGas;
};

export const opExtCodeSize = (state: State) => {
    const address = state.stack.pop();
    const value = state.vm.storage.getCodeSize(state.vm.config.bigIntToAddress(address));
    state.stack.push(value);
};

export const opExtCodeCopy = (state: State) => {
    const address = state.vm.config.bigIntToAddress(state.stack.pop());
    const memOffset = Number(state.stack.pop());
    const codeOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());
    
    const code  = state.vm.storage.getCode(address);
    const codeCopy = getDataSlice(code, codeOffset, length);

    state.memory.set(memOffset, length, codeCopy);
};

export const opReturnDataCopy = (state: State) => {
    const memOffset = Number(state.stack.pop());
    const returnDataOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    if (returnDataOffset + length > state.returnData.length) {
        throw new VmError(ERROR.RETURN_DATA_OUT_OF_BOUNDS);
    }

    const value = getDataSlice(state.returnData, returnDataOffset, length);

    state.memory.set(memOffset, length, value);
};

export const opReturnDataSize = (state: State) => {
    const value = BigInt(state.returnData.length);
    state.stack.push(value);
};

export const opCreate = async (state: State) => {
    const value = state.stack.pop();
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const gas = state.contract.gas - state.contract.gas / 64n;
    const input = state.memory.get(offset, length);

    state.contract.useGas(gas);

    const {
        contractAddress,
        returnData,
        leftOverGas,
        error
    } = await state.vm.create(state.contract, input, gas, value);

    if (error) {
        state.stack.push(0n);
    } else {
        state.stack.push(toBigIntBE(contractAddress));
    }

    state.contract.gas += leftOverGas;

    if (isExecutionReverted(error)) {
        state.returnData = returnData;
    }
};

export const opCreate2 = async (state: State) => {
    const endowment = state.stack.pop();
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());
    const salt = state.stack.pop();

    const gas = state.contract.gas - state.contract.gas / 64n;
    const input = state.memory.get(offset, length);

    state.contract.useGas(gas);

    const {
        contractAddress,
        returnData,
        leftOverGas,
        error
    } = await state.vm.create2(state.contract, input, gas, endowment, salt);

    if (error) {
        state.stack.push(0n);
    } else {
        state.stack.push(toBigIntBE(contractAddress));
    }

    state.contract.gas += leftOverGas;

    if (isExecutionReverted(error)) {
        state.returnData = returnData;
    }
};

export const opRevert = (state: State) => {
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    state.returnData = state.memory.get(offset, length);

    throw new ExecutionRevertedError();
};

export const opExtCodeHash = (state: State) => {
    const address = state.vm.config.bigIntToAddress(state.stack.pop());

    if (state.vm.storage.empty(address)) {
        state.stack.push(0n);
    } else {
        const codeHash = state.vm.storage.getCodeHash(address);
        state.stack.push(toBigIntBE(codeHash));
    }
};

export const opSelfBalance = (state: State) => {
    const balance = state.vm.storage.getBalance(state.contract.address);
    state.stack.push(balance);
};

export const opBlockhash = (state: State) => {
    const n = Number(state.stack.pop());
    const hash = state.vm.config.getBlockHash(n);
    state.stack.push(toBigIntBE(hash));
};

