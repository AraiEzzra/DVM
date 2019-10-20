import { OpCode } from 'src/interpreter/OpCode';
import { Instruction, InstructionSync, InstructionAsync } from 'src/interpreter/Instruction';
import { VmError, ERROR } from 'src/interpreter/exceptions';

import { 
    useGasInvalid,
    useGasZero,
    useGasBase,
    useGasVeryLow,
    useGasLow,
    useGasMid,
    useGasExt,
    useGasHigh,
    useGasExp,
    useGasSload,
    useGasSstore,
    useGasMload,
    useGasMstore,
    useGasMstore8,
    useGasReturn,
    useGasJumpdest,
    useGasSha3,
    useGasCodeCopy,
    useGasCallDataCopy,
    useGasLog,
    useGasBalance,
    useGasCall,
    useGasCallCode,
    useGasSuicide,
    useGasExtCodeSize,
    useGasExtCodeCopy,
    useGasDelegateCall,
    useGasCreate,
 } from 'src/interpreter/useGas';

 import {
     useMemoryMstore,
     useMemoryMstore8,
     useMemoryCodeCopy,
     useMemoryCallDataCopy,
     useMemoryCall,
     useMemoryExtCodeCopy,
     useMemoryDelegateCall
 } from 'src/interpreter/useMemory';

import {
    opInvalid,
    opStop,
    opPush,
    opAdd,
    opSub,
    opMul,
    opDiv,
    opSdiv,
    opMod,
    opSmod,
    opAddmod,
    opMulmod,
    opExp,
    opSignExtend,
    opLt,
    opGt,
    opSlt,
    opSgt,
    opEq,
    opIszero,
    opAnd,
    opOr,
    opXor,
    opNot,
    opByte,
    opSHL,
    opSHR,
    opSAR,
    opSstore,
    opSload,
    opDup,
    opSwap,
    opJumpdest,
    opJump,
    opJumpi,
    opCallDataLoad,
    opNumber,
    opTimestamp,
    opCoinbase,
    opDifficulty,
    opGasLimit,
    opPop,
    opPc,
    opMload,
    opMstore,
    opMstore8,
    opMsize,
    opSha3,
    opReturn,
    opCallValue,
    opGas,
    opCaller,
    opCodeCopy,
    opAddress,
    opCallDataCopy,
    opCallDataSize,
    opCodeSize,
    opGasprice,
    opOrigin,
    opLog,
    opBalance,
    opCall,
    opCallCode,
    opSuicide,
    opExtCodeSize,
    opExtCodeCopy,
    opDelegateCall,
    opReturnDataSize,
    opCreate
} from 'src/interpreter/executors';

export const InstructionList: Array<Instruction> = [
    new InstructionSync({
        opCode: OpCode.STOP,
        execute: opStop,
        useGas: useGasZero,
        halts: true
    }),
    new InstructionSync({
        opCode: OpCode.ADD,
        execute: opAdd,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.MUL,
        execute: opMul,
        useGas: useGasLow
    }),
    new InstructionSync({
        opCode: OpCode.SUB,
        execute: opSub,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DIV,
        execute: opDiv,
        useGas: useGasLow
    }),
    new InstructionSync({
        opCode: OpCode.SDIV,
        execute: opSdiv,
        useGas: useGasLow
    }),
    new InstructionSync({
        opCode: OpCode.MOD,
        execute: opMod,
        useGas: useGasLow
    }),
    new InstructionSync({
        opCode: OpCode.SMOD,
        execute: opSmod,
        useGas: useGasLow
    }),
    new InstructionSync({
        opCode: OpCode.ADDMOD,
        execute: opAddmod,
        useGas: useGasMid
    }),
    new InstructionSync({
        opCode: OpCode.MULMOD,
        execute: opMulmod,
        useGas: useGasMid
    }),
    new InstructionSync({
        opCode: OpCode.EXP,
        execute: opExp,
        useGas: useGasExp
    }),
    new InstructionSync({
        opCode: OpCode.SIGNEXTEND,
        execute: opSignExtend,
        useGas: useGasLow
    }),
    new InstructionSync({
        opCode: OpCode.LT,
        execute: opLt,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.GT,
        execute: opGt,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SLT,
        execute: opSlt,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SGT,
        execute: opSgt,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.EQ,
        execute: opEq,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.ISZERO,
        execute: opIszero,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.AND,
        execute: opAnd,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.OR,
        execute: opOr,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.XOR,
        execute: opXor,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.NOT,
        execute: opNot,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.BYTE,
        execute: opByte,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SHL,
        execute: opSHL,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SHR,
        execute: opSHR,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SAR,
        execute: opSAR,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SHA3,
        execute: opSha3,
        useGas: useGasSha3
    }),
    new InstructionSync({
        opCode: OpCode.ADDRESS,
        execute: opAddress,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.BALANCE,
        execute: opBalance,
        useGas: useGasBalance
    }),
    new InstructionSync({
        opCode: OpCode.ORIGIN,
        execute: opOrigin,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.CALLER,
        execute: opCaller,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.CALLVALUE,
        execute: opCallValue,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.CALLDATALOAD,
        execute: opCallDataLoad,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.CALLDATASIZE,
        execute: opCallDataSize,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.CALLDATACOPY,
        execute: opCallDataCopy,
        useGas: useGasCallDataCopy,
        useMemory: useMemoryCallDataCopy
    }),
    new InstructionSync({
        opCode: OpCode.CODESIZE,
        execute: opCodeSize,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.CODECOPY,
        execute: opCodeCopy,
        useGas: useGasCodeCopy,
        useMemory: useMemoryCodeCopy
    }),
    new InstructionSync({
        opCode: OpCode.GASPRICE,
        execute: opGasprice,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.EXTCODESIZE,
        execute: opExtCodeSize,
        useGas: useGasExtCodeSize
    }),
    new InstructionSync({
        opCode: OpCode.EXTCODECOPY,
        execute: opExtCodeCopy,
        useGas: useGasExtCodeCopy,
        useMemory: useMemoryExtCodeCopy
    }),
    new InstructionSync({
        opCode: OpCode.RETURNDATASIZE,
        execute: opReturnDataSize,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.RETURNDATACOPY,
        execute: opInvalid,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.EXTCODEHASH,
        execute: opInvalid,
        useGas: useGasInvalid
    }),
    new InstructionSync({
        opCode: OpCode.BLOCKHASH,
        execute: opInvalid,
        useGas: useGasExt
    }),
    new InstructionSync({
        opCode: OpCode.COINBASE,
        execute: opCoinbase,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.TIMESTAMP,
        execute: opTimestamp,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.NUMBER,
        execute: opNumber,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.DIFFICULTY,
        execute: opDifficulty,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.GASLIMIT,
        execute: opGasLimit,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.CHAINID,
        execute: opInvalid,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.SELFBALANCE,
        execute: opInvalid,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.POP,
        execute: opPop,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.MLOAD,
        execute: opMload,
        useGas: useGasMload
    }),
    new InstructionSync({
        opCode: OpCode.MSTORE,
        execute: opMstore,
        useGas: useGasMstore,
        useMemory: useMemoryMstore
    }),
    new InstructionSync({
        opCode: OpCode.MSTORE8,
        execute: opMstore8,
        useGas: useGasMstore8,
        useMemory: useMemoryMstore8
    }),
    new InstructionSync({
        opCode: OpCode.SLOAD,
        execute: opSload,
        useGas: useGasSload
    }),
    new InstructionSync({
        opCode: OpCode.SSTORE,
        execute: opSstore,
        useGas: useGasSstore
    }),
    new InstructionSync({
        opCode: OpCode.JUMP,
        execute: opJump,
        useGas: useGasMid
    }),
    new InstructionSync({
        opCode: OpCode.JUMPI,
        execute: opJumpi,
        useGas: useGasHigh
    }),
    new InstructionSync({
        opCode: OpCode.PC,
        execute: opPc,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.MSIZE,
        execute: opMsize,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.GAS,
        execute: opGas,
        useGas: useGasBase
    }),
    new InstructionSync({
        opCode: OpCode.JUMPDEST,
        execute: opJumpdest,
        useGas: useGasJumpdest
    }),
    new InstructionSync({
        opCode: OpCode.PUSH1,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH2,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH3,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH4,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH5,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH6,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH7,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH8,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH9,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH10,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH11,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH12,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH13,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH14,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH15,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH16,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH17,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH18,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH19,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH20,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH21,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH22,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH23,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH24,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH25,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH26,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH27,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH28,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH29,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH30,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH31,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.PUSH32,
        execute: opPush,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP1,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP2,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP3,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP4,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP5,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP6,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP7,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP8,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP9,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP10,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP11,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP12,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP13,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP14,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP15,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.DUP16,
        execute: opDup,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP1,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP2,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP3,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP4,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP5,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP6,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP7,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP8,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP9,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP10,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP11,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP12,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP13,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP14,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP15,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.SWAP16,
        execute: opSwap,
        useGas: useGasVeryLow
    }),
    new InstructionSync({
        opCode: OpCode.LOG0,
        execute: opLog,
        useGas: useGasLog
    }),
    new InstructionSync({
        opCode: OpCode.LOG1,
        execute: opLog,
        useGas: useGasLog
    }),
    new InstructionSync({
        opCode: OpCode.LOG2,
        execute: opLog,
        useGas: useGasLog
    }),
    new InstructionSync({
        opCode: OpCode.LOG3,
        execute: opLog,
        useGas: useGasLog
    }),
    new InstructionSync({
        opCode: OpCode.LOG4,
        execute: opLog,
        useGas: useGasLog
    }),
    new InstructionAsync({
        opCode: OpCode.CREATE,
        execute: opCreate,
        useGas: useGasCreate
    }),
    new InstructionAsync({
        opCode: OpCode.CALL,
        execute: opCall,
        useGas: useGasCall,
        useMemory: useMemoryCall
    }),
    new InstructionAsync({
        opCode: OpCode.CALLCODE,
        execute: opCallCode,
        useGas: useGasCallCode,
        useMemory: useMemoryCall
    }),
    new InstructionSync({
        opCode: OpCode.RETURN,
        execute: opReturn,
        useGas: useGasReturn,
        halts: true
    }),
    new InstructionAsync({
        opCode: OpCode.DELEGATECALL,
        execute: opDelegateCall,
        useGas: useGasDelegateCall,
        useMemory: useMemoryDelegateCall
    }),
    new InstructionSync({
        opCode: OpCode.CREATE2,
        execute: opInvalid,
        useGas: useGasInvalid
    }),
    new InstructionSync({
        opCode: OpCode.STATICCALL,
        execute: opInvalid,
        useGas: useGasInvalid
    }),
    new InstructionSync({
        opCode: OpCode.REVERT,
        execute: opInvalid,
        useGas: useGasZero
    }),
    new InstructionSync({
        opCode: OpCode.SUICIDE,
        execute: opSuicide,
        useGas: useGasSuicide,
        halts: true
    })
];

export const Instructions = InstructionList.reduce((instructions, item) => {
    instructions[item.opCode] = item;
    return instructions;
}, {});

export const getInstruction = (opCode: OpCode): Instruction => {
    const instruction = Instructions[opCode] as Instruction;
    if (instruction === undefined) {
        throw new VmError(ERROR.INVALID_OPCODE(opCode));
    }
    return instruction;
};
