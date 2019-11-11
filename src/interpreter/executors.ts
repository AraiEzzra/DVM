import { toBigIntBE, toBufferBE } from 'bigint-buffer';
import { dupPosition, pushBytes, swapPosition, logBytes } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';
import { VmError, ERROR, isExecutionReverted } from 'src/exceptions';
import { U256 } from 'src/interpreter/U256';
import { keccak256 } from 'src/interpreter/hash';
import { getDataSlice, bigIntToBuffer } from 'src/interpreter/utils';

export const opInvalid = (state: State): Buffer => {
    throw new VmError(ERROR.INVALID_OPCODE(state.opCode));
};

export const opStop = (state: State): Buffer => {
    return Buffer.alloc(0);
};

export const opAdd = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = U256.asUint(a + b);
    state.stack.push(result);

    return null;
};

export const opMul = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = U256.asUint(a * b);
    state.stack.push(result);

    return null;
};

export const opSub = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = U256.asUint(a - b);
    state.stack.push(result);

    return null;
};

export const opDiv = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = b === 0n
        ? 0n
        : U256.asUint(a / b);
    state.stack.push(result);

    return null;
};

export const opSdiv = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = b === 0n
        ? 0n
        : U256.asUint(U256.asInt(a) / U256.asInt(b));
    state.stack.push(result);

    return null;
};

export const opMod = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = b === 0n
        ? 0n
        : U256.asUint(a % b);
    state.stack.push(result);

    return null;
};

export const opSmod = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = b === 0n
        ? 0n
        : U256.asUint(U256.asInt(a) % U256.asInt(b));
    state.stack.push(result);

    return null;
};

export const opAddmod = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    const c = state.stack.pop();

    const result = c === 0n
        ? 0n
        : U256.asUint((a + b) % c);

    state.stack.push(result);

    return null;
};

export const opMulmod = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    const c = state.stack.pop();

    const result = c === 0n
        ? 0n
        : U256.asUint((a * b) % c);

    state.stack.push(result);

    return null;
};

export const opExp = (state: State): Buffer => {
    const base = state.stack.pop();
    const exponent = state.stack.pop();

    const result = U256.expmod(base, exponent);
    state.stack.push(result);

    return null;
};

export const opSignExtend = (state: State): Buffer => {
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

    return null;
};

export const opLt = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = a < b ? 1n : 0n;
    state.stack.push(result);

    return null;
};

export const opGt = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = a > b ? 1n : 0n;
    state.stack.push(result);

    return null;
};

export const opSlt = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = U256.asInt(a) < U256.asInt(b) ? 1n : 0n;
    state.stack.push(result);

    return null;
};

export const opSgt = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = U256.asInt(a) > U256.asInt(b) ? 1n : 0n;
    state.stack.push(result);

    return null;
};

export const opEq = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();

    const result = a === b ? 1n : 0n;
    state.stack.push(result);

    return null;
};

export const opIszero = (state: State): Buffer => {
    const a = state.stack.pop();
    const result = a === 0n ? 1n : 0n;
    state.stack.push(result);

    return null;
};

export const opAnd = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = a & b;
    state.stack.push(result);

    return null;
};

export const opOr = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = a | b;
    state.stack.push(result);

    return null;
};

export const opXor = (state: State): Buffer => {
    const a = state.stack.pop();
    const b = state.stack.pop();
    
    const result = a ^ b;
    state.stack.push(result);

    return null;
};

export const opNot = (state: State): Buffer => {
    const a = state.stack.pop();
    const result = U256.asUint(~a);
    state.stack.push(result);

    return null;
};

export const opByte = (state: State): Buffer => {
    const pos = state.stack.pop();
    const word = state.stack.pop();

    const result = pos < 32n
        ? (word >> (248n - pos * 8n)) & U256.BYTE
        : 0n;

    state.stack.push(result);

    return null;
};

export const opSHL = (state: State): Buffer => {
    const shift = state.stack.pop();
    const value = state.stack.pop();

    const result = shift < 256n
        ? U256.asUint(value << shift)
        : 0n;

    state.stack.push(result);

    return null;
};

export const opSHR = (state: State): Buffer => {
    const shift = state.stack.pop();
    const value = state.stack.pop();

    const result = shift < 256n
        ? U256.asUint(value >> shift)
        : 0n;

    state.stack.push(result);

    return null;
};

export const opSAR = (state: State): Buffer => {
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

    return null;
};

export const opSha3 = (state: State): Buffer => {
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const data = state.memory.get(offset, length);
    const result = toBigIntBE(keccak256(data));

    state.stack.push(result);

    return null;
};

export const opPush = (state: State): Buffer => {
    const numToPush = pushBytes(state.opCode);

    const value = state.contract.code
        .slice(state.programCounter, state.programCounter + numToPush);

    state.programCounter += numToPush;
    state.stack.push(toBigIntBE(value));

    return null;
};

export const opDup = (state: State): Buffer => {
    const stackPos = dupPosition(state.opCode);
    state.stack.dup(stackPos);

    return null;
};

export const opSwap = (state: State): Buffer => {
    const stackPos = swapPosition(state.opCode);
    state.stack.swap(stackPos);

    return null;
};

export const opSload = (state: State): Buffer => {
    const key = toBufferBE(state.stack.pop(), 32);
    const value = state.vm.storage.getValue(state.contract.address, key);

    state.stack.push(toBigIntBE(value));

    return null;
};

export const opSstore = (state: State): Buffer => {
    const key = toBufferBE(state.stack.pop(), 32);
    const value = bigIntToBuffer(state.stack.pop());

    state.vm.emit('sstore', [
        state.contract.address.toString('hex'),
        key.toString('hex'),
        value.toString('hex')
    ]);

    state.vm.storage.setValue(state.contract.address, key, value);

    return null;
};

export const opJumpdest = (state: State): Buffer => {
    return null;
};

export const opJump = (state: State): Buffer => {
    const dest = Number(state.stack.pop());

    if (!state.isJumpValid(dest)) {
        throw new VmError(ERROR.INVALID_JUMP);
    }

    state.programCounter = dest;

    return null;
};

export const opJumpi = (state: State): Buffer => {
    const dest = Number(state.stack.pop());
    const cond = Number(state.stack.pop());
   
    if (cond !== 0) {
        if (!state.isJumpValid(dest)) {
            throw new VmError(ERROR.INVALID_JUMP);
        }
    
        state.programCounter = dest;
    }

    return null;
};

export const opCallDataLoad = (state: State): Buffer => {
    const offset = Number(state.stack.pop());
    const data = getDataSlice(state.contract.input, offset, 32);

    state.stack.push(toBigIntBE(data));

    return null;
};

export const opCallValue = (state: State): Buffer => {
    state.stack.push(state.contract.value);
    return null;
};

export const opNumber = (state: State): Buffer => {
    state.stack.push(state.vm.context.blockNumber);
    return null;
};

export const opTimestamp = (state: State): Buffer => {
    state.stack.push(state.vm.context.time);
    return null;
};

export const opCoinbase = (state: State): Buffer => {
    state.stack.push(toBigIntBE(state.vm.context.coinbase));
    return null;
};

export const opDifficulty = (state: State): Buffer => {
    state.stack.push(state.vm.context.difficulty);
    return null;
};

export const opGasLimit = (state: State): Buffer => {
    state.stack.push(state.vm.context.gasLimit);
    return null;
};

export const opPop = (state: State): Buffer => {
    state.stack.pop();
    return null;
};

export const opPc = (state: State): Buffer => {
    state.stack.push(BigInt(state.programCounter - 1));
    return null;
};

export const opMload = (state: State): Buffer => {
    const offset = Number(state.stack.pop());
    const value = state.memory.get(offset, 32);

    state.stack.push(toBigIntBE(value));

    return null;
};

export const opMstore = (state: State): Buffer => {
    const offset = Number(state.stack.pop());
    const value = toBufferBE(state.stack.pop(), 32);

    state.memory.set(offset, 32, value);

    return null;
};

export const opMstore8 = (state: State): Buffer => {
    const offset = Number(state.stack.pop());
    const value = toBufferBE(state.stack.pop() & U256.BYTE, 1);

    state.memory.set(offset, 1, value);

    return null;
};

export const opMsize = (state: State): Buffer => {
    state.stack.push(state.memoryWordCount * 32n);
    return null;
};

export const opReturn = (state: State): Buffer => {
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const data = state.memory.get(offset, length);

    return data;
};

export const opGas = (state: State): Buffer => {
    state.stack.push(state.contract.gas);
    return null;
};

export const opCaller = (state: State): Buffer => {
    state.stack.push(toBigIntBE(state.contract.callerAddress));
    return null;
};

export const opCodeCopy = (state: State): Buffer => {
    const memOffset = Number(state.stack.pop());
    const codeOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const data = getDataSlice(state.contract.code, codeOffset, length);
    state.memory.set(memOffset, length, data);
    return null;
};

export const opAddress = (state: State): Buffer => {
    state.stack.push(toBigIntBE(state.contract.address));
    return null;
};

export const opCallDataCopy = (state: State): Buffer => {
    const memOffset = Number(state.stack.pop());
    const codeOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const data = getDataSlice(state.contract.input, codeOffset, length);
    state.memory.set(memOffset, length, data);
    return null;
};

export const opCallDataSize = (state: State): Buffer => {
    const value = BigInt(state.contract.input.length);
    state.stack.push(value);
    return null;
};

export const opCodeSize = (state: State): Buffer => {
    const value = BigInt(state.contract.code.length);
    state.stack.push(value);
    return null;
};

export const opGasprice = (state: State): Buffer => {
    state.stack.push(state.vm.context.gasPrice);
    return null;
};

export const opOrigin = (state: State): Buffer => {
    state.stack.push(toBigIntBE(state.vm.context.origin));
    return null;
};

export const opLog = (state: State): Buffer => {
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());
    const topicsCount = logBytes(state.opCode);
    const topics: Array<Buffer> = [];

    for (let i = 0; i < topicsCount ; i++) {
        topics.push(toBufferBE(state.stack.pop(), 32));
    }

    const data = state.memory.get(offset, length);

    state.vm.storage.addLog({
        address: state.contract.address,
        topics,
        data
    });

    return null;
};

export const opSuicide = (state: State): Buffer => {
    const address = state.stack.pop();
    const balance = state.vm.storage.getBalance(state.contract.address);
    state.vm.storage.addBalance(state.vm.config.bigIntToAddress(address), balance);

    state.vm.storage.suicide(state.contract.address);

    return Buffer.alloc(0);
};

export const opBalance = (state: State): Buffer => {
    const address = state.stack.pop();
    const value = state.vm.storage.getBalance(state.vm.config.bigIntToAddress(address));

    state.stack.push(value);

    return null;
};

export const opCall = async (state: State): Promise<Buffer> => {
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
        state.memory.setSlice(outOffset, outLength, returnData);
    }

    state.contract.gas += leftOverGas;

    return returnData;
};

export const opCallCode = async (state: State): Promise<Buffer> => {
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
        state.memory.setSlice(outOffset, outLength, returnData);
    }

    state.contract.gas += leftOverGas;

    return returnData;
};

export const opDelegateCall = async (state: State): Promise<Buffer> => {
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
        state.memory.setSlice(outOffset, outLength, returnData);
    }

    state.contract.gas += leftOverGas;

    return returnData;
};

export const opStaticCall = async (state: State): Promise<Buffer> => {
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
        state.memory.setSlice(outOffset, outLength, returnData);
    }

    state.contract.gas += leftOverGas;

    return returnData;
};

export const opExtCodeSize = (state: State): Buffer => {
    const address = state.stack.pop();
    const value = state.vm.storage.getCodeSize(state.vm.config.bigIntToAddress(address));
    state.stack.push(value);
    return null;
};

export const opExtCodeCopy = (state: State): Buffer => {
    const address = state.vm.config.bigIntToAddress(state.stack.pop());
    const memOffset = Number(state.stack.pop());
    const codeOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());
    
    const code  = state.vm.storage.getCode(address);
    const codeCopy = getDataSlice(code, codeOffset, length);

    state.memory.set(memOffset, length, codeCopy);

    return null;
};

export const opReturnDataCopy = (state: State): Buffer => {
    const memOffset = Number(state.stack.pop());
    const returnDataOffset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    if (returnDataOffset + length > state.returnData.length) {
        throw new VmError(ERROR.RETURN_DATA_OUT_OF_BOUNDS);
    }

    const value = getDataSlice(state.returnData, returnDataOffset, length);

    state.memory.set(memOffset, length, value);

    return null;
};

export const opReturnDataSize = (state: State): Buffer => {
    const value = BigInt(state.returnData.length);
    state.stack.push(value);
    return null;
};

export const opCreate = async (state: State): Promise<Buffer> => {
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
        return returnData;
    }
    return Buffer.alloc(0);
};

export const opCreate2 = async (state: State): Promise<Buffer> => {
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
        return returnData;
    }
    return Buffer.alloc(0);
};

export const opRevert = (state: State): Buffer => {
    const offset = Number(state.stack.pop());
    const length = Number(state.stack.pop());

    const data = state.memory.get(offset, length);

    return data;
};

export const opExtCodeHash = (state: State): Buffer => {
    const address = state.vm.config.bigIntToAddress(state.stack.pop());

    if (state.vm.storage.empty(address)) {
        state.stack.push(0n);
    } else {
        const codeHash = state.vm.storage.getCodeHash(address);
        state.stack.push(toBigIntBE(codeHash));
    }
    return null;
};

export const opSelfBalance = (state: State): Buffer => {
    const balance = state.vm.storage.getBalance(state.contract.address);
    state.stack.push(balance);
    return null;
};

export const opBlockhash = (state: State): Buffer => {
    const n = Number(state.stack.pop());
    const hash = state.vm.config.getBlockHash(n);
    state.stack.push(toBigIntBE(hash));
    return null;
};

