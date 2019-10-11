import { IContext } from 'src/IContext';
import { IStorage } from 'src/IStorage';
import { Message } from 'src/Message';
import { GasPool } from 'src/GasPool';
import { StateTransition } from 'src/StateTransition';
import { Interpreter } from 'src/interpreter/Interpreter';
import { Contract, ContractRef } from 'src/Contract';
import { PARAMS } from 'src/constants';
import { VmError, ERROR } from 'src/interpreter/exceptions';

export type VMResult = {
    returnData: Buffer;
    leftOverGas: bigint;
};

export class VM {

    private depth: number;

    readonly context: IContext;

    readonly storage: IStorage;

    constructor(context: IContext, storage: IStorage) {
        this.context = context;
        this.storage = storage;
        this.depth = 0;
    }

    accountRef(address: Buffer): ContractRef {
        return { address } as ContractRef;
    }

    async applyMessage(message: Message, gasPool: GasPool) {
        const stateTransition = new StateTransition(this, message, gasPool);
        return await stateTransition.run();
   }

    async run(contract: Contract, input: Buffer): Promise<Buffer> {
        const interpreter = new Interpreter(this, contract);
        return interpreter.run(input);
    } 

    async call(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint, value: bigint): Promise<VMResult> {
        if (this.depth > PARAMS.CallCreateDepth) {
            throw new VmError(ERROR.DEPTH);
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            throw new VmError(ERROR.INSUFFICIENT_BALANCE);
        }

        const to = this.accountRef(address);
        const snapshot = this.storage.snapshot();

        if (!this.storage.exist(address)) {
            this.storage.createAccount(address);
        }

        this.context.transfer(this.storage, caller.address, to.address, value);

        const contract = new Contract(caller, to, value, gas);
        contract.setCallCode(address, this.storage.getCode(address));

        try {
            return {
                returnData: await this.run(contract, input),
                leftOverGas: contract.gas
            };
        } catch (error) {
            this.storage.revertToSnapshot(snapshot);
            throw error;
        }
    }
}
