import { toBigIntBE, toBufferBE } from 'bigint-buffer';
import { dupPosition, pushBytes, swapPosition } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';
import { VmError, ERROR } from 'src/interpreter/exceptions';
import { U256 } from 'src/interpreter/U256';
import { keccak256 } from 'src/interpreter/hash';
import { getDataSlice } from 'src/interpreter/utils';

export const opInvalid = (state: State) => {
    throw new VmError(ERROR.INVALID_OPCODE(state.opCode));        
};

export const opStop = (state: State) => {
    state.eei.finish();
};

export const opAdd = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = U256.asUint(a + b);
    state.stack.push(r);
};

export const opMul = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = U256.asUint(a * b);
    state.stack.push(r);
};

export const opSub = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = U256.asUint(a - b);
    state.stack.push(r);
};

export const opDiv = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = b === 0n
        ? 0n
        : U256.asUint(a / b);
    state.stack.push(r);
};

export const opSdiv = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = b === 0n
        ? 0n
        : U256.asUint(U256.asInt(a) / U256.asInt(b));
    state.stack.push(r);
};

export const opMod = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = b === 0n
        ? 0n
        : U256.asUint(a % b);
    state.stack.push(r);
};

export const opSmod = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = b === 0n
        ? 0n
        : U256.asUint(U256.asInt(a) % U256.asInt(b));
    state.stack.push(r);
};

export const opAddmod = (state: State) => {
    const [a, b, c] = state.stack.popN(3);
    const r = c === 0n
        ? 0n
        : U256.asUint((a + b) % c);

    state.stack.push(r);
};

export const opMulmod = (state: State) => {
    const [a, b, c] = state.stack.popN(3);
    const r = c === 0n
        ? 0n
        : U256.asUint((a * b) % c);

    state.stack.push(r);
};

export const opExp = (state: State) => {
    const [base, exponent] = state.stack.popN(2);
    const r = U256.expmod(base, exponent);
    state.stack.push(r);
};

export const opSignExtend = (state: State) => {
    const [k, value] = state.stack.popN(2);

    if (k < 31n) {
        const bit = k * 8n + 7n;
        const mask = (1n << bit) - 1n;

        const r = U256.bit(value, bit) === 1n
            ? value | (~mask)
            : value & mask;

        state.stack.push(U256.asUint(r));
        return;
    }

    state.stack.push(value);
};

export const opLt = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = a < b ? 1n : 0n;
    state.stack.push(r);
};

export const opGt = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = a > b ? 1n : 0n;
    state.stack.push(r);
};

export const opSlt = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = U256.asInt(a) < U256.asInt(b) ? 1n : 0n;
    state.stack.push(r);
};

export const opSgt = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = U256.asInt(a) > U256.asInt(b) ? 1n : 0n;
    state.stack.push(r);
};

export const opEq = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = a === b ? 1n : 0n;
    state.stack.push(r);
};

export const opIszero = (state: State) => {
    const a = state.stack.pop();
    const r = a === 0n ? 1n : 0n;
    state.stack.push(r);
};

export const opAnd = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = a & b;
    state.stack.push(r);
};

export const opOr = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = a | b;
    state.stack.push(r);
};

export const opXor = (state: State) => {
    const [a, b] = state.stack.popN(2);
    const r = a ^ b;
    state.stack.push(r);
};

export const opNot = (state: State) => {
    const a = state.stack.pop();
    const r = U256.asUint(~a);
    state.stack.push(r);
};

export const opByte = (state: State) => {
    const [pos, word] = state.stack.popN(2);
    const r = pos < 32n
        ? (word >> (248n - pos * 8n)) & U256.BYTE
        : 0n;

    state.stack.push(r);
};

export const opSHL = (state: State) => {
    const [shift, value] = state.stack.popN(2);
    const r = shift < 256n
        ? U256.asUint(value << shift)
        : 0n;

    state.stack.push(r);
};

export const opSHR = (state: State) => {
    const [shift, value] = state.stack.popN(2);
    const r = shift < 256n
        ? U256.asUint(value >> shift)
        : 0n;

    state.stack.push(r);
};

export const opSAR = (state: State) => {
    const [shift, value] = state.stack.popN(2);

    if (shift < 256n) {
        const r = U256.asUint(U256.asInt(value) >> shift);
        state.stack.push(r);
    } else {
        const isSigned = U256.asInt(value) >= 0;
        const r = U256.asUint(isSigned ? 0n : -1n);
        state.stack.push(r);
    }
};

export const opSha3 = (state: State) => {
    const [offset, length] = state.stack.popN(2);
    const data = state.memory.get(Number(offset), Number(length));
    const r = toBigIntBE(keccak256(data));

    state.stack.push(r);
};

export const opPush = (state: State) => {
    const numToPush = pushBytes(state.opCode);

    const value = state.eei.getCode()
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
    let key = state.stack.pop();
    const keyBuffer = toBufferBE(key, 32);

    // TODO add address
    const valueBuffer = state.storage.getValue('', keyBuffer);
    const value = toBigIntBE(valueBuffer);

    state.stack.push(value);
};

export const opSstore = (state: State) => {
    let [key, value] = state.stack.popN(2);
    const keyBuffer = toBufferBE(key, 32);
    const valueBuffer = value === 0n
        ? Buffer.alloc(0)
        : toBufferBE(value, 32);

    // TODO add address
    state.storage.setValue('', keyBuffer, valueBuffer);
};

export const opJumpdest = (state: State) => {};

export const opJump = (state: State) => {
    const dest = state.stack.pop();
    const destNum = Number(dest);

    if (destNum > state.eei.getCode().length) {
        throw new VmError(ERROR.INVALID_JUMP);
    }

    if (!state.validJumps.has(destNum)) {
        throw new VmError(ERROR.INVALID_JUMP);
    }

    state.programCounter = destNum;
};

export const opJumpi = (state: State) => {
    const [dest, cond] = state.stack.popN(2);

    if (cond !== 0n) {
        const destNum = Number(dest);

        if (destNum > state.eei.getCode().length) {
            throw new VmError(ERROR.INVALID_JUMP);
        }

        if (!state.validJumps.has(destNum)) {
            throw new VmError(ERROR.INVALID_JUMP);
        }

        state.programCounter = destNum;
    }
};

export const opCallDataLoad = (state: State) => {
    const pos = state.stack.pop();

    if (pos > state.eei.getCallDataSize()) {
        state.stack.push(0n);
        return;
    }

    const offset = Number(pos);
    const data = getDataSlice(state.eei.getCallData(), offset, 32);
    const r = toBigIntBE(data);

    state.stack.push(r);
};

export const opCallValue = (state: State) => {
    const r = toBigIntBE(state.eei.getCallValue());
    state.stack.push(r);
};

export const opNumber = (state: State) => {
    state.stack.push(state.eei.getBlockNumber());
};

export const opTimestamp = (state: State) => {
    state.stack.push(state.eei.getBlockTimestamp());
};

export const opCoinbase = (state: State) => {
    state.stack.push(state.eei.getBlockCoinbase());
};

export const opDifficulty = (state: State) => {
    state.stack.push(state.eei.getBlockDifficulty());
};

export const opGasLimit = (state: State) => {
    state.stack.push(state.eei.getBlockGasLimit());
};

export const opPop = (state: State) => {
    state.stack.pop();
};

export const opPc = (state: State) => {
    state.stack.push(BigInt(state.programCounter - 1));
};

export const opMload = (state: State) => {
    const pos = state.stack.pop();
    const buffer = state.memory.get(Number(pos), 32);
    const r = toBigIntBE(buffer);
    state.stack.push(r);
};

export const opMstore = (state: State) => {
    const [offset, word] = state.stack.popN(2);
    const buffer = toBufferBE(word, 32);

    const offsetNum = Number(offset);
    state.memory.set(offsetNum, 32, buffer);
};

export const opMstore8 = (state: State) => {
    let [offset, byte] = state.stack.popN(2);

    const buffer = toBufferBE(byte & U256.BYTE, 1);
    const offsetNum = Number(offset);

    state.memory.set(offsetNum, 1, buffer);
};

export const opMsize = (state: State) => {
    state.stack.push(state.memoryWordCount * 32n);
};

export const opReturn = (state: State) => {
    const [offset, length] = state.stack.popN(2);
    const value = state.memory.get(Number(offset), Number(length));
    state.eei.finish(value);
};

export const opGas = (state: State) => {
    state.stack.push(state.eei.getGasLeft());
};

export const opCaller = (state: State) => {
    const r = toBigIntBE(state.eei.getCaller());
    state.stack.push(r);
};

export const opCodeCopy = (state: State) => {
    const [memOffset, codeOffset, length] = state.stack.popN(3);

    const memOffsetNum = Number(memOffset);
    const codeOffsetNum = Number(codeOffset);
    const lengthNum = Number(length);

    const data = getDataSlice(state.eei.getCode(), codeOffsetNum, lengthNum);
    state.memory.set(memOffsetNum, lengthNum, data);
};

export const opAddress = (state: State) => {
    const r = toBigIntBE(state.eei.getAddress());
    state.stack.push(r);
};

export const opCallDataCopy = (state: State) => {
    const [memOffset, codeOffset, length] = state.stack.popN(3);

    const memOffsetNum = Number(memOffset);
    const codeOffsetNum = Number(codeOffset);
    const lengthNum = Number(length);

    const data = getDataSlice(state.eei.getCallData(), codeOffsetNum, lengthNum);
    state.memory.set(memOffsetNum, lengthNum, data);
};

export const opCallDataSize = (state: State) => {
    state.stack.push(state.eei.getCallDataSize());
};

export const opCodeSize = (state: State) => {
    state.stack.push(state.eei.getCodeSize());
};

export const opGasprice = (state: State) => {
    state.stack.push(state.eei.getTxGasPrice());
};

export const opOrigin = (state: State) => {
    const r = toBigIntBE(state.eei.getTxOrigin());
    state.stack.push(r);
};

export const opLog = (state: State) => {
    const [memOffset, memLength] = state.stack.popN(2);
    const topicsCount = state.opCode - 0xa0;
    const topics = state.stack.popN(topicsCount);
    const topicsBuf = topics.map(item => toBufferBE(item, 32));
    const mem = memLength === 0n
        ? Buffer.alloc(0)
        : state.memory.get(Number(memOffset), Number(memLength));

    state.eei.log(mem, topicsCount, topicsBuf);
};

export const opSuicide = (state: State) => {
    
};
