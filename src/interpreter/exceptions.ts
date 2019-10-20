import { OpCode, opCodeToHex } from 'src/interpreter/OpCode';

export class ERROR {
    static OUT_OF_GAS = 'out of gas';
    static STACK_UNDERFLOW = 'stack underflow';
    static STACK_OVERFLOW = 'stack overflow';
    static INVALID_JUMP = 'invalid JUMP';
    static INVALID_OPCODE = (opCode: OpCode): string => `invalid opcode: ${opCodeToHex(opCode)}`;
    static OUT_OF_RANGE = 'value out of range';
    static REVERT = 'revert';
    static STATIC_STATE_CHANGE = 'static state change';
    static INTERNAL_ERROR = 'internal error';
    static CREATE_COLLISION = 'create collision';
    static STOP = 'stop';
    static REFUND_EXHAUSTED = 'refund exhausted';
    static INVALID_MEMORY = 'invalid memory: store empty';    
    static DEPTH = 'max call depth exceeded';
    static INSUFFICIENT_BALANCE = 'insufficient balance for transfer';
    static GAS_LIMIT_REACHED = 'gas limit reached';
    static INSUFFICIENT_BALANCE_FOR_GAS = 'insufficient balance to pay for gas';
    static CONTRACT_ADDRESS_COLLISION = 'contract address collision';
    static MAX_CODE_SIZE_EXCEEDED = 'evm: max code size exceeded';
}

export class VmError extends Error {}

