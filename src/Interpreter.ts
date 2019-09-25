import { State } from 'src/State';
import { OpInsts } from 'src/OpInsts';
import { ERROR, VmError } from 'src/exceptions';

export class Interpreter {

    private readonly state: State;

    constructor() {
        this.state = new State();
    }

    async run(code: Buffer) {
        this.state.code = code;

        while (this.state.programCounter < this.state.code.length) {
            const opCode = this.state.code[this.state.programCounter];
            this.state.opCode = opCode;

            try {
                await this.runStep();
            } catch (e) {
                                
            }
        }
    }
    
    async runStep() {

    }
}
