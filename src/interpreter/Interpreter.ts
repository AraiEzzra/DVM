import { State } from 'src/interpreter/State';
import { VM } from 'src/VM';
import { Contract } from 'src/Contract';
import { InstructionsIterable } from 'src/interpreter/InstructionsIterable';

export class Interpreter {

    readonly vm: VM;

    readonly contract: Contract;

    constructor(vm: VM, contract: Contract) {
        this.vm = vm;
        this.contract = contract;
    }

    async run(input: Buffer): Promise<Buffer> {
        const state = new State(this);
        const instructions = new InstructionsIterable(state);

        this.contract.input = input;

        for (const instruction of instructions) {

            instruction.useGas(state);

            if (instruction.useMemory) {
                instruction.useMemory(state);
            }

            instruction.isAsync
                ? await instruction.execute(state)
                : instruction.execute(state);
        }

        return state.returnData;
    }
}
