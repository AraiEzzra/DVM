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
    error?: Error;
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

    // TODO
    async call(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint, value: bigint): Promise<VMResult> {
        if (this.depth > PARAMS.CallCreateDepth) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.INSUFFICIENT_BALANCE) };
        }

        const to = this.accountRef(address);
        const snapshot = this.storage.snapshot();

        if (!this.storage.exist(address)) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas };
            //this.storage.createAccount(address);
        }

        this.context.transfer(this.storage, caller.address, to.address, value);

        const contract = new Contract(caller, to, value, gas);
        contract.setCallCode(address, this.storage.getCode(address));

        try {

            const returnData = await this.run(contract, input);
            return { returnData, leftOverGas: contract.gas };

        } catch (error) {

            this.storage.revertToSnapshot(snapshot);

            contract.useGas(contract.gas);

            return {
                returnData: Buffer.alloc(0),
                leftOverGas: contract.gas,
                error
            };
        }
    }

    // TODO
    async callCode(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint, value: bigint): Promise<VMResult> {
        if (this.depth > PARAMS.CallCreateDepth) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.INSUFFICIENT_BALANCE) };
        }

        const to = this.accountRef(address);
        const snapshot = this.storage.snapshot();

        const contract = new Contract(caller, to, value, gas);
        contract.setCallCode(address, this.storage.getCode(address));

        try {

            const returnData = await this.run(contract, input);
            return { returnData, leftOverGas: contract.gas };

        } catch (error) {

            this.storage.revertToSnapshot(snapshot);

            contract.useGas(contract.gas);

            return {
                returnData: Buffer.alloc(0),
                leftOverGas: contract.gas,
                error
            };
        }
    }
    
    
}
