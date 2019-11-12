import { State } from 'src/interpreter/State';
import { VM } from 'src/VM';
import { Contract } from 'src/Contract';
import { ExecutionRevertedError } from 'src/exceptions';
import { getInstruction } from 'src/interpreter/Instructions';

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
        const length = state.contract.code.length;

        while (state.programCounter < length) {

            // Need to fix "Check failed: !isolate->has_scheduled_exception().";
            if (state.programCounter === 0) {
                await Promise.resolve();
            }

            const opCode = state.contract.code[state.programCounter];
            const instruction = getInstruction(opCode);

            state.opCode = opCode;

            if (!instruction.jumps) {
                state.programCounter++;
            }

            instruction.verifyState(state);

            this.vm.emit('step', state);

            instruction.useGas(state);

            if (instruction.useMemory) {
                instruction.useMemory(state);
            }

            const returnData = <Buffer>(instruction.isAsync
                ? await instruction.execute(state)
                : instruction.execute(state));

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
