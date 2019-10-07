import { EEI } from 'src/EEI';
import { IStorage } from 'src/IStorage';
import { Stack } from 'src/interpreter/Stack';
import { Memory } from 'src/interpreter/Memory';
import { opCodeToString } from 'src/interpreter/OpCode';

export class State {
    programCounter: number;
    opCode: number;
    stack: Stack;
    memory: Memory;
    code: Buffer;
    eei: EEI;
    storage: IStorage;
    validJumps: Set<number>;
    // TODO
    highestMemCost: bigint;
    memoryWordCount: bigint;

    constructor(eei: EEI, storage: IStorage) {
        this.programCounter = 0;
        this.opCode = 0xfe; // INVALID opcode
        this.eei = eei;
        this.stack = new Stack();
        this.memory = new Memory();
        this.code = Buffer.alloc(0);
        this.storage = storage;
        this.validJumps = new Set();
        this.highestMemCost = 0n;
        this.memoryWordCount = 0n;
    }

    toString(): string {
        return `
PC ${this.programCounter}: ${opCodeToString(this.opCode)} GAS: 9999999994 COST: 3
STACK = ${this.stack.length}
${this.stack.toString()}
MEM = 0
STORAGE = ${this.storage.size}
${this.storage.toString()}        
`;
    }
}
