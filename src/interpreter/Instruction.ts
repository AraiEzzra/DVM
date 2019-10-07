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
};

export class Instruction {
    opCode: OpCode;
    isAsync: boolean;
    execute: ExecutorSync | ExecutorAsync;
    useGas: UseGas;
    useMemory?: UseMemory;

    constructor(data: InstructionData) {
        this.opCode = data.opCode;
        this.isAsync = data.isAsync;
        this.execute = data.execute;
        this.useGas = data.useGas;
        this.useMemory = data.useMemory;
    }
}

export type InstructionSyncData = {
    opCode: OpCode;
    execute: ExecutorSync;
    useGas: UseGas;
    useMemory?: UseMemory; 
};

export class InstructionSync extends Instruction {
    constructor(data: InstructionSyncData) {
        super({
            opCode: data.opCode,
            execute: data.execute,
            isAsync: false,
            useGas: data.useGas,
            useMemory: data.useMemory
        });
    }
}

export type InstructionAsyncData = {
    opCode: OpCode;
    execute: ExecutorAsync;
    useGas: UseGas; 
    useMemory?: UseMemory;
};

export class InstructionAsync extends Instruction {
    constructor(data: InstructionAsyncData) {
        super({
            opCode: data.opCode,
            execute: data.execute,
            isAsync: true,
            useGas: data.useGas,
            useMemory: data.useMemory
        });
    }
}
