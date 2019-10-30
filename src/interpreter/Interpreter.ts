import { State } from 'src/interpreter/State';
import { VM } from 'src/VM';
import { Contract } from 'src/Contract';
import { InstructionsIterable } from 'src/interpreter/InstructionsIterable';
import { ExecutionRevertedError } from 'src/exceptions';

export type InterpreterResult = {
    returnData: Buffer;
    error?: Error;
};

export class Interpreter {

    readonly vm: VM;

    readonly contract: Contract;

    private prevReadOnly: boolean;

    private readOnly: boolean;

    constructor(vm: VM, contract: Contract) {
        this.vm = vm;
        this.contract = contract;
    }

    async run(input: Buffer, readOnly: boolean): Promise<InterpreterResult> {
        const state = new State(this);
        let result: InterpreterResult; 

        this.contract.input = input;
        this.readOnly = readOnly;

        this.beforeRunState();

        try {
            result = await this.runState(state);
        } catch (error) {
            result = {
                returnData: Buffer.alloc(0),
                error
            };
        }

        this.afterRunState();

        if (result.error) {
            this.vm.emit('vmerror', result.error);
        }

        return result;
    }

    private beforeRunState() {
        this.vm.state.depth ++;
        if (this.vm.state.readOnly === undefined) {
            this.vm.state.readOnly = this.readOnly;
        }
        this.prevReadOnly = this.vm.state.readOnly;
        if (!this.prevReadOnly) {
            this.vm.state.readOnly = this.readOnly;
        }
    }

    private afterRunState() {
        this.vm.state.depth --;
        this.vm.state.readOnly = this.prevReadOnly;
    }

    private async runState(state: State): Promise<InterpreterResult> {
        const instructions = new InstructionsIterable(state);

        for (const instruction of instructions) {

            instruction.verifyState(state);

            this.vm.emit('step', state);

            instruction.useGas(state);

            if (instruction.useMemory) {
                instruction.useMemory(state);
            }

            const returnData = await instruction.execute(state);

            if (instruction.returns) {
                state.returnData = returnData;
            }

            if (instruction.reverts) {
                return { returnData, error: new ExecutionRevertedError() };
            }
            if (instruction.halts) {
                return { returnData };
            }
        }

        return { returnData: Buffer.alloc(0) };
    }
}
