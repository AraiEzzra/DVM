import { Instruction } from 'src/interpreter/Instruction';
import { getInstruction } from 'src/interpreter/Instructions';
import { State } from 'src/interpreter/State';

export class InstructionsIterable {

    private state: State;

    private readonly length: number;

    private done: boolean;

    constructor(state: State) {
        this.state = state;
        this.length = this.state.contract.code.length;
        this.done = false;
    }

    next() {
        if (this.state.programCounter < this.length && !this.done) {
            const opCode = this.state.contract.code[this.state.programCounter];
            const instruction = getInstruction(opCode);

            this.state.opCode = opCode;

            if (!instruction.jumps) {
                this.state.programCounter++;
            }

            if (instruction.halts) {
                this.done = true;
            }

            return {
                value: instruction,
                done: false
            };
        }

        return {
            value: undefined,
            done: true
        };
    }

    [Symbol.iterator](): Iterator<Instruction> {
        return {
            next: () => this.next()
        };
    }  
}
