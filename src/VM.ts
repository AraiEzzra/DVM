import { IContext } from 'src/IContext';
import { IStorage } from 'src/IStorage';
import { Config, PARAMS } from 'src/Config';
import { Message } from 'src/Message';
import { GasPool } from 'src/GasPool';
import { StateTransition } from 'src/StateTransition';
import { Interpreter } from 'src/interpreter/Interpreter';
import { Contract, ContractRef, IPrecompiledContract } from 'src/Contract';
import { VmError, ERROR } from 'src/interpreter/exceptions';
import { getPrecompiledContract } from 'src/precompiles';

export type VMCallResult = {
    returnData: Buffer;
    leftOverGas: bigint;
    error?: Error;
};

export type VMCreateResult = {
    contractAddress: Buffer;
    returnData: Buffer;
    leftOverGas: bigint;
    error?: Error;
};

export class VM {

    private depth: number;

    readonly context: IContext;

    readonly storage: IStorage;

    readonly config: Config;

    constructor(context: IContext, storage: IStorage, config: Config) {
        this.context = context;
        this.storage = storage;
        this.config = config;
        this.config.params = { ...PARAMS, ...config.params };
        this.depth = 0;
    }

    addDepth() {
        this.depth ++;
    }

    accountRef(address: Buffer): ContractRef {
        return { address } as ContractRef;
    }

    async applyMessage(message: Message, gasPool: GasPool) {
        const stateTransition = new StateTransition(this, message, gasPool);
        return await stateTransition.run();
   }

    async run(contract: Contract, input: Buffer): Promise<Buffer> {
        if (contract.codeAddress) {
            const pContract = getPrecompiledContract(contract.codeAddress);
            if (pContract) {
                return this.runPrecompiledContract(pContract, input, contract);
            }
        }

        const interpreter = new Interpreter(this, contract);

        return interpreter.run(input);
    } 

    async runPrecompiledContract(pContract: IPrecompiledContract, input: Buffer, contract: Contract): Promise<Buffer> {
        const gas = pContract.requiredGas(input);
        contract.useGas(gas);
        return pContract.run(input);
    }

    // TODO
    async call(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint, value: bigint): Promise<VMCallResult> {
        if (this.depth > this.config.params.CallCreateDepth) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.INSUFFICIENT_BALANCE) };
        }

        const to = this.accountRef(address);
        const snapshot = this.storage.snapshot();

        if (!this.storage.exist(address)) {
            if (getPrecompiledContract(address) === null && value === 0n) {
                return { returnData: Buffer.alloc(0), leftOverGas: gas };
            }
            this.storage.createAccount(address);
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
    async callCode(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint, value: bigint): Promise<VMCallResult> {
        if (this.depth > this.config.params.CallCreateDepth) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.INSUFFICIENT_BALANCE) };
        }

        const to = this.accountRef(caller.address);
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

    // TODO
    async delegateCall(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint): Promise<VMCallResult> {
        if (this.depth > this.config.params.CallCreateDepth) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        const to = this.accountRef(caller.address);
        const snapshot = this.storage.snapshot();

        const contract = new Contract(caller, to, null, gas).asDelegate();
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

    private async createContract(caller: ContractRef, code: Buffer, gas: bigint, value: bigint, address: Buffer): Promise<VMCreateResult> {
        if (this.depth > this.config.params.CallCreateDepth) {
            return { contractAddress: null, returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            return { contractAddress: null, returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.INSUFFICIENT_BALANCE) };
        }

        const nonce = this.storage.getNonce(caller.address);
        this.storage.setNonce(caller.address, nonce + 1n);

        const contractCode = this.storage.getCode(address);

        if (this.storage.getNonce(address) !== 0n || contractCode.length !== 0) {
            return { contractAddress: null, returnData: Buffer.alloc(0), leftOverGas: 0n, error: new VmError(ERROR.CONTRACT_ADDRESS_COLLISION) };
        }

        const snapshot = this.storage.snapshot();

        this.storage.createAccount(address);
        this.storage.setNonce(address, 1n);
        this.context.transfer(this.storage, caller.address, address, value);

        const contract = new Contract(caller, this.accountRef(address), value, gas);
        contract.setCallCode(address, code);

        
        try {

            const returnData = await this.run(contract, null);

            if (returnData.length > this.config.params.MaxCodeSize) {
                throw new Error(ERROR.MAX_CODE_SIZE_EXCEEDED);
            }

            const createDataGas = BigInt(returnData.length) * this.config.params.CreateDataGas;

            contract.useGas(createDataGas);

            this.storage.setCode(address, returnData);

            return {
                contractAddress: address,
                leftOverGas: contract.gas,
                returnData
            }

        } catch (error) {

            this.storage.revertToSnapshot(snapshot);
            
            contract.useGas(contract.gas);

            return {
                contractAddress: address,
                returnData: Buffer.alloc(0),
                leftOverGas: contract.gas,
                error
            };
        }
                  
    }

    //TODO
    async create(caller: ContractRef, code: Buffer, gas: bigint, value: bigint): Promise<VMCreateResult> {
        const contractAddress = this.config.createAddress(caller.address, this.storage.getNonce(caller.address));
        return this.createContract(caller, code, gas, value, contractAddress);
    }        
}
