import { OpCode } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';
import { VmError, ERROR } from 'src/exceptions';

export interface ExecutorSync {
    (state: State): Buffer;
}

export interface ExecutorAsync {
    (state: State): Promise<Buffer>;
}

export interface UseGas {
    (state: State): void;
}

export type StackRange = {
    min: number;
    max: number;
};

export interface UseMemory {
    (state: State): void;
}

export type InstructionData = {
    opCode: OpCode;
    execute: ExecutorSync | ExecutorAsync;
    isAsync: boolean;
    useGas: UseGas;
    stackRange: StackRange;
    useMemory?: UseMemory;
    halts?: boolean;
    jumps?: boolean;
    writes?: boolean;
    returns?: boolean;
    reverts?: boolean;    
};

export class Instruction {
    opCode: OpCode;
    execute: ExecutorSync | ExecutorAsync;
    isAsync: boolean;
    useGas: UseGas;
    minStack: number;
    maxStack: number;
    useMemory?: UseMemory;
    halts: boolean;
    jumps: boolean;
    writes: boolean;
    returns: boolean;
    reverts: boolean;

    constructor(data: InstructionData) {
        this.opCode = data.opCode;
        this.execute = data.execute;
        this.isAsync = data.isAsync;
        this.useGas = data.useGas;
        this.useMemory = data.useMemory;
        this.halts = Boolean(data.halts);
        this.jumps = Boolean(data.jumps);
        this.writes = Boolean(data.writes);
        this.returns = Boolean(data.returns);
        this.reverts = Boolean(data.reverts);

        this.minStack = data.stackRange.min;
        this.maxStack = data.stackRange.max;
    }

    verifyState(state: State) {
        if (state.vm.state.readOnly) {
            if (this.writes) {
                throw new VmError(ERROR.WRITE_PROTECTION);
            }
            if (this.opCode === OpCode.CALL && state.stack.back(2) !== 0n) {
                throw new VmError(ERROR.WRITE_PROTECTION);
            }
        }

        if (state.stack.length < this.minStack) {
            throw new VmError(ERROR.STACK_UNDERFLOW);
        }

        if (state.stack.length > this.maxStack) {
            throw new VmError(ERROR.STACK_OVERFLOW);
        }
    }
}

export type InstructionSyncData = Omit<InstructionData, 'isAsync'>;

export class InstructionSync extends Instruction {
    constructor(syncData: InstructionSyncData) {
        super({ ...syncData, isAsync: false });
    }
}

export type InstructionAsyncData = Omit<InstructionData, 'isAsync'>;

export class InstructionAsync extends Instruction {
    constructor(asyncData: InstructionAsyncData) {
        super({ ...asyncData, isAsync: true });
    }
}
