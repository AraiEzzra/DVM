import { State } from 'src/interpreter/State';
import { VM } from 'src/VM';
import { Contract } from 'src/Contract';
import { InstructionsIterable } from 'src/interpreter/InstructionsIterable';
import { opCodeToString, OpCode } from 'src/interpreter/OpCode';
import { VmError, ERROR } from '../exceptions';

export type InterpreterResult = {
    returnData: Buffer;
    error?: Error;
};

export class Interpreter {

    readonly vm: VM;

    readonly contract: Contract;

    constructor(vm: VM, contract: Contract) {
        this.vm = vm;
        this.contract = contract;
    }

    async run(input: Buffer, readOnly: boolean): Promise<InterpreterResult> {
        let error: Error;
        const state = new State(this);
        const instructions = new InstructionsIterable(state);

        this.contract.input = input;
        state.readOnly = readOnly;

        this.vm.addDepth();

        try {

            for (const instruction of instructions) {

                instruction.verifyState(state);

                this.vm.emit('step', state);
    
                instruction.useGas(state);
    
                if (instruction.useMemory) {
                    instruction.useMemory(state);
                }
    
                instruction.isAsync
                    ? await instruction.execute(state)
                    : instruction.execute(state);
            }

        } catch (returnError) {
            this.vm.emit('vmerror', returnError);
            error = returnError;
        }

        return {
            error,
            returnData: state.returnData
        };
    }
}
