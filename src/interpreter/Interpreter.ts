import { IContext } from 'src/IContext';
import { IStorage } from 'src/IStorage';
import { OpCode, isPush, pushBytes } from 'src/interpreter/OpCode';
import { Instruction } from 'src/interpreter/Instruction';
import { Instructions } from 'src/interpreter/Instructions';
import { State } from 'src/interpreter/State';
import { EEI } from 'src/EEI';
import { ERROR, VmError, VmStop } from 'src/interpreter/exceptions';
import { VMResult } from 'src/VM';

export class Interpreter {

    private readonly state: State;

    constructor(context: IContext, storage: IStorage) {
        const eei = new EEI(context);
        this.state = new State(eei, storage);
    }

    async run(code: Buffer): Promise<VMResult> {
        this.state.code = code;
        this.state.validJumps = this.getValidJumpDests(code);

        while (this.state.programCounter < this.state.code.length) {
            const opCode = this.state.code[this.state.programCounter];
            this.state.opCode = opCode;

            try {
                await this.runStep();
            } catch (e) {
                if (e instanceof VmStop) {
                    // TODO
                } else {
                    throw new Error(e);
                }
                break;
            }
        }

        return Promise.resolve({
            out: this.state.eei.result.value,
            gasUsed: this.state.eei.gasLimit - this.state.eei.gasLeft
        });
    }
    
    async runStep() {
        const instruction = this.getInstruction(this.state.opCode);

        instruction.useGas(this.state);

        if (instruction.useMemory) {
            instruction.useMemory(this.state);
        }

        this.state.programCounter++;

        instruction.isAsync
            ? await instruction.execute(this.state)
            : instruction.execute(this.state);
    }

    private getInstruction(opCode: OpCode): Instruction {
        const instruction = Instructions[opCode] as Instruction;
        if (instruction === undefined) {
            throw new VmError(ERROR.INVALID_OPCODE(opCode));
        }
        return instruction;
    }

    private getValidJumpDests(codes: Buffer): Set<number> {
        const jumps = new Set<number>();

        for (let i = 0; i < codes.length; i++) {
            const code = codes[i];
            const instruction = this.getInstruction(code);

            // no destinations into the middle of PUSH
            if (isPush(instruction.opCode)) {
                i += pushBytes(code);
            }

            if (instruction.opCode === OpCode.JUMPDEST) {
                jumps.add(i);
            }
        }

        return jumps;
    }
}
