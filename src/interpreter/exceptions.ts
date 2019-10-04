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
}

export class VmError extends Error {}

export class VmStop extends Error {}
