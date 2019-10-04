import { IContext } from 'src/IContext';
import { IStorage } from 'src/IStorage';
import { Interpreter } from 'src/interpreter/Interpreter';

export type VMResult = {
    out: Buffer;
    gasUsed: bigint;
};

export class VM {

    private context: IContext;

    private storage: IStorage;

    private interpreter: Interpreter;

    constructor(context: IContext, storage: IStorage) {
        this.context = context;
        this.storage = storage;
        this.interpreter = new Interpreter(context, storage);
    }

    async runCode(code: Buffer): Promise<VMResult> {
        return await this.interpreter.run(code);
    }
}
