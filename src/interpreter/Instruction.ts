import { OpCode } from 'src/interpreter/OpCode';
import { State } from 'src/interpreter/State';

export interface ExecutorSync {
    (state: State): void;
}

export interface ExecutorAsync {
    (state: State): Promise<void>;
}

export interface UseGas {
    (state: State): void;
}

export interface UseMemory {
    (state: State): void;
}

export type InstructionData = {
    opCode: OpCode;
    isAsync: boolean;
    execute: ExecutorSync | ExecutorAsync;
    useGas: UseGas;
    useMemory?: UseMemory;
    halts?: boolean;
    jumps?: boolean;
};

export class Instruction {
    opCode: OpCode;
    isAsync: boolean;
    execute: ExecutorSync | ExecutorAsync;
    useGas: UseGas;
    useMemory?: UseMemory;
    halts?: boolean;
    jumps?: boolean;

    constructor(data: InstructionData) {
        this.opCode = data.opCode;
        this.isAsync = data.isAsync;
        this.execute = data.execute;
        this.useGas = data.useGas;
        this.useMemory = data.useMemory;
        this.halts = Boolean(data.halts);
        this.jumps = Boolean(data.jumps);
    }
}

export type InstructionSyncData = {
    opCode: OpCode;
    execute: ExecutorSync;
    useGas: UseGas;
    useMemory?: UseMemory; 
    halts?: boolean;
    jumps?: boolean;
};

export class InstructionSync extends Instruction {
    constructor(syncData: InstructionSyncData) {
        super({ ...syncData, isAsync: false });
    }
}

export type InstructionAsyncData = {
    opCode: OpCode;
    execute: ExecutorAsync;
    useGas: UseGas; 
    useMemory?: UseMemory;
    halts?: boolean;
    jumps?: boolean;
};

export class InstructionAsync extends Instruction {
    constructor(asyncData: InstructionAsyncData) {
        super({ ...asyncData, isAsync: true });
    }
}
