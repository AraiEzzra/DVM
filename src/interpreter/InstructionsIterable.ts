import { Instruction } from 'src/interpreter/Instruction';
import { getInstruction } from 'src/interpreter/Instructions';
import { State } from 'src/interpreter/State';

export class InstructionsIterable implements IterableIterator<Instruction> {

    private readonly state: State;

    private readonly length: number;

    constructor(state: State) {
        this.state = state;
        this.length = this.state.contract.code.length;
    }

    next(): IteratorResult<Instruction> {
        if (this.state.programCounter < this.length) {
            const opCode = this.state.contract.code[this.state.programCounter];
            const instruction = getInstruction(opCode);

            this.state.opCode = opCode;

            if (!instruction.jumps) {
                this.state.programCounter++;
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

    [Symbol.iterator](): IterableIterator<Instruction> {
        return this;
    }  
}
