import { OpCode } from 'src/OpCode';
import { State } from 'src/Interpreter';

export interface OpFnSync {
    (state: State): void;
}

export interface OpFnAsync {
    (state: State): Promise<void>;
}

export class OpInst {
    opCode: OpCode;
    fee: number;
    isAsync: boolean;
    opFn: OpFnSync | OpFnAsync;

    constructor(opCode: OpCode, fee: number, execute: { opFn: OpFnSync | OpFnAsync, isAsync: boolean }) {
        this.opCode = opCode;
        this.fee = fee;
        this.isAsync = execute.isAsync;
        this.opFn = execute.opFn;
    }
}

export class OpInstSync extends OpInst {
    constructor(opCode: OpCode, fee: number, opFn: OpFnSync) {
        super(opCode, fee, { opFn, isAsync: false });
    }
}

export class OpInstAsync extends OpInst {
    constructor(opCode: OpCode, fee: number, opFn: OpFnAsync) {
        super(opCode, fee, { opFn, isAsync: true });
    }
}
