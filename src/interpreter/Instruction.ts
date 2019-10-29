import { OpCode } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';
import { VmError, ERROR } from 'src/exceptions';

export interface ExecutorSync {
    (state: State): void;
}

export interface ExecutorAsync {
    (state: State): Promise<void>;
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
    isAsync: boolean;
    execute: ExecutorSync | ExecutorAsync;
    useGas: UseGas;
    stackRange: StackRange;
    useMemory?: UseMemory;
    halts?: boolean;
    jumps?: boolean;
    writes?: boolean;
};

export class Instruction {
    opCode: OpCode;
    isAsync: boolean;
    execute: ExecutorSync | ExecutorAsync;
    useGas: UseGas;
    minStack: number;
    maxStack: number;
    useMemory?: UseMemory;
    halts?: boolean;
    jumps?: boolean;
    writes?: boolean;

    constructor(data: InstructionData) {
        this.opCode = data.opCode;
        this.isAsync = data.isAsync;
        this.execute = data.execute;
        this.useGas = data.useGas;
        this.useMemory = data.useMemory;
        this.halts = Boolean(data.halts);
        this.jumps = Boolean(data.jumps);
        this.writes = Boolean(data.writes);

        this.minStack = data.stackRange.min;
        this.maxStack = data.stackRange.max;
    }

    verifyState(state: State) {
        if (state.readOnly) {
            if (this.writes) {
                throw new VmError(ERROR.WRITE_PROTECTION);
            }
            if (this.opCode === OpCode.CALL && state.stack.back(0) !== 0n) {
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
