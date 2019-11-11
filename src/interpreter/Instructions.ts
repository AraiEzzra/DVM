import { OpCode, stringToOpCode } from 'src/interpreter/OpCode';
import { Instruction, InstructionSync, InstructionAsync } from 'src/interpreter/Instruction';

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
    useGasReturnDataCopy,
    useGasRevert,
    useGasCreate2,
    useGasStaticCall,
    useGasExtCodeHash,
 } from 'src/interpreter/useGas';

 import {
     useMemoryMstore,
     useMemoryMstore8,
     useMemoryCodeCopy,
     useMemoryCallDataCopy,
     useMemoryCall,
     useMemoryExtCodeCopy,
     useMemoryDelegateCall,
     useMemoryReturnDataCopy,
     useMemoryStaticCall
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
    opReturnDataCopy,
    opCreate,
    opRevert,
    opCreate2,
    opStaticCall,
    opExtCodeHash,
    opSelfBalance,
    opBlockhash
} from 'src/interpreter/executors';

import {
    stackRange,
    swapStackRange,
    dupStackRange
} from 'src/interpreter/stackRange';

export const InstructionList: Array<Instruction> = [
    new InstructionSync({
        opCode: OpCode.STOP,
        execute: opStop,
        useGas: useGasZero,
        stackRange: stackRange(0, 0),
        halts: true
    }),
    new InstructionSync({
        opCode: OpCode.ADD,
        execute: opAdd,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.MUL,
        execute: opMul,
        useGas: useGasLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SUB,
        execute: opSub,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.DIV,
        execute: opDiv,
        useGas: useGasLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SDIV,
        execute: opSdiv,
        useGas: useGasLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.MOD,
        execute: opMod,
        useGas: useGasLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SMOD,
        execute: opSmod,
        useGas: useGasLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.ADDMOD,
        execute: opAddmod,
        useGas: useGasMid,
        stackRange: stackRange(3, 1),
    }),
    new InstructionSync({
        opCode: OpCode.MULMOD,
        execute: opMulmod,
        useGas: useGasMid,
        stackRange: stackRange(3, 1),
    }),
    new InstructionSync({
        opCode: OpCode.EXP,
        execute: opExp,
        useGas: useGasExp,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SIGNEXTEND,
        execute: opSignExtend,
        useGas: useGasLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.LT,
        execute: opLt,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.GT,
        execute: opGt,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SLT,
        execute: opSlt,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SGT,
        execute: opSgt,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.EQ,
        execute: opEq,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.ISZERO,
        execute: opIszero,
        useGas: useGasVeryLow,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.AND,
        execute: opAnd,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.OR,
        execute: opOr,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.XOR,
        execute: opXor,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.NOT,
        execute: opNot,
        useGas: useGasVeryLow,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.BYTE,
        execute: opByte,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SHL,
        execute: opSHL,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SHR,
        execute: opSHR,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SAR,
        execute: opSAR,
        useGas: useGasVeryLow,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SHA3,
        execute: opSha3,
        useGas: useGasSha3,
        stackRange: stackRange(2, 1),
    }),
    new InstructionSync({
        opCode: OpCode.ADDRESS,
        execute: opAddress,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.BALANCE,
        execute: opBalance,
        useGas: useGasBalance,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.ORIGIN,
        execute: opOrigin,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.CALLER,
        execute: opCaller,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.CALLVALUE,
        execute: opCallValue,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.CALLDATALOAD,
        execute: opCallDataLoad,
        useGas: useGasVeryLow,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.CALLDATASIZE,
        execute: opCallDataSize,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.CALLDATACOPY,
        execute: opCallDataCopy,
        useGas: useGasCallDataCopy,
        stackRange: stackRange(3, 0),
        useMemory: useMemoryCallDataCopy,
    }),
    new InstructionSync({
        opCode: OpCode.CODESIZE,
        execute: opCodeSize,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.CODECOPY,
        execute: opCodeCopy,
        useGas: useGasCodeCopy,
        stackRange: stackRange(3, 0),
        useMemory: useMemoryCodeCopy
    }),
    new InstructionSync({
        opCode: OpCode.GASPRICE,
        execute: opGasprice,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.EXTCODESIZE,
        execute: opExtCodeSize,
        useGas: useGasExtCodeSize,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.EXTCODECOPY,
        execute: opExtCodeCopy,
        useGas: useGasExtCodeCopy,
        stackRange: stackRange(4, 0),
        useMemory: useMemoryExtCodeCopy,
    }),
    new InstructionSync({
        opCode: OpCode.RETURNDATASIZE,
        execute: opReturnDataSize,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.RETURNDATACOPY,
        execute: opReturnDataCopy,
        useGas: useGasReturnDataCopy,
        stackRange: stackRange(3, 0),
        useMemory: useMemoryReturnDataCopy
    }),
    new InstructionSync({
        opCode: OpCode.EXTCODEHASH,
        execute: opExtCodeHash,
        useGas: useGasExtCodeHash,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.BLOCKHASH,
        execute: opBlockhash,
        useGas: useGasExt,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.COINBASE,
        execute: opCoinbase,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.TIMESTAMP,
        execute: opTimestamp,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.NUMBER,
        execute: opNumber,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.DIFFICULTY,
        execute: opDifficulty,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.GASLIMIT,
        execute: opGasLimit,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SELFBALANCE,
        execute: opInvalid,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.POP,
        execute: opPop,
        useGas: useGasBase,
        stackRange: stackRange(1, 0),
    }),
    new InstructionSync({
        opCode: OpCode.MLOAD,
        execute: opMload,
        useGas: useGasMload,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.MSTORE,
        execute: opMstore,
        useGas: useGasMstore,
        stackRange: stackRange(2, 0),
        useMemory: useMemoryMstore
    }),
    new InstructionSync({
        opCode: OpCode.MSTORE8,
        execute: opMstore8,
        useGas: useGasMstore8,
        stackRange: stackRange(2, 0),
        useMemory: useMemoryMstore8
    }),
    new InstructionSync({
        opCode: OpCode.SLOAD,
        execute: opSload,
        useGas: useGasSload,
        stackRange: stackRange(1, 1),
    }),
    new InstructionSync({
        opCode: OpCode.SSTORE,
        execute: opSstore,
        useGas: useGasSstore,
        stackRange: stackRange(2, 0),
        writes: true
    }),
    new InstructionSync({
        opCode: OpCode.JUMP,
        execute: opJump,
        useGas: useGasMid,
        stackRange: stackRange(1, 0),
    }),
    new InstructionSync({
        opCode: OpCode.JUMPI,
        execute: opJumpi,
        useGas: useGasHigh,
        stackRange: stackRange(2, 0),
    }),
    new InstructionSync({
        opCode: OpCode.PC,
        execute: opPc,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.MSIZE,
        execute: opMsize,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.GAS,
        execute: opGas,
        useGas: useGasBase,
        stackRange: stackRange(0, 1),
    }),
    new InstructionSync({
        opCode: OpCode.JUMPDEST,
        execute: opJumpdest,
        useGas: useGasJumpdest,
        stackRange: stackRange(0, 0),
    }),
    new InstructionSync({
        opCode: OpCode.LOG0,
        execute: opLog,
        useGas: useGasLog,
        stackRange: stackRange(2, 0),
        writes: true
    }),
    new InstructionSync({
        opCode: OpCode.LOG1,
        execute: opLog,
        useGas: useGasLog,
        stackRange: stackRange(3, 0),
        writes: true
    }),
    new InstructionSync({
        opCode: OpCode.LOG2,
        execute: opLog,
        useGas: useGasLog,
        stackRange: stackRange(4, 0),
        writes: true
    }),
    new InstructionSync({
        opCode: OpCode.LOG3,
        execute: opLog,
        useGas: useGasLog,
        stackRange: stackRange(5, 0),
        writes: true
    }),
    new InstructionSync({
        opCode: OpCode.LOG4,
        execute: opLog,
        useGas: useGasLog,
        stackRange: stackRange(6, 0),
        writes: true
    }),
    new InstructionAsync({
        opCode: OpCode.CREATE,
        execute: opCreate,
        useGas: useGasCreate,
        stackRange: stackRange(3, 1),
        returns: true,
        writes: true
    }),
    new InstructionAsync({
        opCode: OpCode.CALL,
        execute: opCall,
        useGas: useGasCall,
        stackRange: stackRange(7, 1),
        useMemory: useMemoryCall,
        returns: true,
    }),
    new InstructionAsync({
        opCode: OpCode.CALLCODE,
        execute: opCallCode,
        useGas: useGasCallCode,
        stackRange: stackRange(7, 1),
        useMemory: useMemoryCall,
        returns: true,
    }),
    new InstructionSync({
        opCode: OpCode.RETURN,
        execute: opReturn,
        useGas: useGasReturn,
        stackRange: stackRange(2, 0),
        halts: true
    }),
    new InstructionAsync({
        opCode: OpCode.DELEGATECALL,
        execute: opDelegateCall,
        useGas: useGasDelegateCall,
        stackRange: stackRange(6, 1),
        useMemory: useMemoryDelegateCall,
        returns: true
    }),
    new InstructionAsync({
        opCode: OpCode.CREATE2,
        execute: opCreate2,
        useGas: useGasCreate2,
        stackRange: stackRange(4, 1),
        writes: true,
        returns: true,
    }),
    new InstructionAsync({
        opCode: OpCode.STATICCALL,
        execute: opStaticCall,
        useGas: useGasStaticCall,
        stackRange: stackRange(6, 1),
        useMemory: useMemoryStaticCall,
        returns: true,
    }),
    new InstructionSync({
        opCode: OpCode.REVERT,
        execute: opRevert,
        useGas: useGasRevert,
        stackRange: stackRange(2, 0),
        reverts: true,
        returns: true
    }),
    new InstructionSync({
        opCode: OpCode.SUICIDE,
        execute: opSuicide,
        useGas: useGasSuicide,
        stackRange: stackRange(1, 0),
        halts: true,
        writes: true
    })
];

for (let i = 1; i <= 32; i++) {
    InstructionList.push(
        new InstructionSync({
            opCode: stringToOpCode(`PUSH${i}`),
            execute: opPush,
            useGas: useGasVeryLow,
            stackRange: stackRange(0, 1),
        })
    );
}

for (let i = 1; i <= 16; i++) {
    InstructionList.push(
        new InstructionSync({
            opCode: stringToOpCode(`DUP${i}`),
            execute: opDup,
            useGas: useGasVeryLow,
            stackRange: dupStackRange(i),
        })
    );

    InstructionList.push(
        new InstructionSync({
            opCode: stringToOpCode(`SWAP${i}`),
            execute: opSwap,
            useGas: useGasVeryLow,
            stackRange: swapStackRange(i),
        })
    );
}

export const Instructions = InstructionList.reduce((instructions, item) => {
    instructions[item.opCode] = item;
    return instructions;
}, {});

export const getInstruction = (opCode: OpCode): Instruction => {
    const instruction = Instructions[opCode] as Instruction;
    if (instruction === undefined) {
        return new InstructionSync({
            opCode,
            execute: opInvalid,
            useGas: useGasZero,
            stackRange: stackRange(0, 0),
        });
    }
    return instruction;
};
