import { Stack } from 'src/Stack';

export class State {
    programCounter: number;
    opCode: number;
    stack: Stack;
    code: Buffer;

    constructor() {
        this.programCounter = 0;
        this.opCode = 0xfe; // INVALID opcode
        this.stack = new Stack();
        this.code = Buffer.alloc(0);
    }
}
