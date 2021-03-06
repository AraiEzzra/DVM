import { OpCode, isPush, pushBytes } from 'src/interpreter/OpCode';
import { getInstruction } from 'src/interpreter/Instructions';
import { Stack } from 'src/interpreter/Stack';
import { Memory } from 'src/interpreter/Memory';
import { VM } from 'src/VM';
import { Interpreter } from 'src/interpreter/Interpreter';
import { Contract } from 'src/Contract';
import { Params } from 'src/Config';

export class State {
    interpreter: Interpreter;
    contract: Contract;
    vm: VM;
    params: Params;
    stack: Stack;
    memory: Memory;
    programCounter: number;
    opCode: number;
    code: Buffer;
    validJumps: Set<number>;
    highestMemCost: bigint;
    memoryWordCount: bigint;
    returnData: Buffer;
    callGasTemp: bigint;

    constructor(interpreter: Interpreter) {
        this.interpreter = interpreter;
        this.contract = interpreter.contract;
        this.vm = interpreter.vm;
        this.params = interpreter.vm.config.params;
        this.stack = new Stack();
        
        this.memory = new Memory();
        this.programCounter = 0;
        this.opCode = null;
        this.validJumps = this.getValidJumpDests(this.contract.code);
        this.highestMemCost = 0n;
        this.memoryWordCount = 0n;
        this.returnData = Buffer.alloc(0);
        this.callGasTemp = 0n;
    }

    isJumpValid(dest: number): boolean {
        return dest < this.contract.code.length && this.validJumps.has(dest);
    }

    private getValidJumpDests(codes: Buffer): Set<number> {
        const jumps = new Set<number>();

        for (let i = 0; i < codes.length; i++) {
            const code = codes[i];
            const instruction = getInstruction(code);

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
