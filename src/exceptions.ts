import { OpCode, opCodeToHex } from 'src/interpreter/OpCode';

export class ERROR {
    static OUT_OF_GAS = 'out of gas';
    static STACK_UNDERFLOW = 'stack underflow';
    static STACK_OVERFLOW = 'stack overflow';
    static INVALID_JUMP = 'invalid JUMP';
    static INVALID_OPCODE = (opCode: OpCode): string => `invalid opcode: ${opCodeToHex(opCode)}`;
    static INVALID_MEMORY = 'invalid memory: store empty';
    static DEPTH = 'max call depth exceeded';
    static INSUFFICIENT_BALANCE = 'insufficient balance for transfer';
    static GAS_LIMIT_REACHED = 'gas limit reached';
    static INSUFFICIENT_BALANCE_FOR_GAS = 'insufficient balance to pay for gas';
    static CONTRACT_ADDRESS_COLLISION = 'contract address collision';
    static MAX_CODE_SIZE_EXCEEDED = 'vm: max code size exceeded';
    static RETURN_DATA_OUT_OF_BOUNDS = 'vm: return data out of bounds';
    static WRITE_PROTECTION = 'vm: write protection';
    static EXECUTION_REVERTED = 'vm: write protection';
}

export class VmError extends Error {}

export class ExecutionRevertedError extends VmError {
    constructor() {
        super();
        this.message = ERROR.EXECUTION_REVERTED;
    }
}

export const isExecutionReverted = (error: Error): boolean => error instanceof ExecutionRevertedError;

export class TransitionError extends Error {}
