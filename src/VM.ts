import { IContext } from 'src/IContext';
import { IStorage } from 'src/IStorage';
import { Config, PARAMS, PRECOMPILES } from 'src/Config';
import { Message } from 'src/Message';
import { GasPool } from 'src/GasPool';
import { StateTransition } from 'src/StateTransition';
import { Interpreter, InterpreterResult } from 'src/interpreter/Interpreter';
import { Contract, ContractRef, IPrecompiledContract } from 'src/Contract';
import {
    VmError,
    ERROR,
    isExecutionReverted,
    TransitionError
} from 'src/exceptions';
import { toBigIntBE } from 'bigint-buffer';
import { EventEmitter } from 'events';

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

export class VM extends EventEmitter {

    private depth: number;

    readonly context: IContext;

    readonly storage: IStorage;

    readonly config: Config;

    constructor(context: IContext, storage: IStorage, config: Config) {
        super();
        this.context = context;
        this.storage = storage;
        this.config = this.prepareСonfig(config);
        this.depth = 0;
    }

    private prepareСonfig(config: Config): Config {
        return {
            ...config,
            params: { ...PARAMS, ...config.params },
            precompiles: { ...PRECOMPILES, ...config.precompiles }
        };
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

    private getPrecompiledContract(codeAddress: Buffer): IPrecompiledContract {
        const n = toBigIntBE(codeAddress);
        if (n <= 0xffn) {
            return this.config.precompiles[Number(n)];
        }
    }

    async run(contract: Contract, input: Buffer, readOnly: boolean = false): Promise<InterpreterResult> {
        if (contract.codeAddress) {
            const precompiled = this.getPrecompiledContract(contract.codeAddress);
            if (precompiled) {
                return this.runPrecompiledContract(precompiled, contract, input);
            }
        }

        const interpreter = new Interpreter(this, contract);

        return interpreter.run(input, readOnly);
    } 

    async runPrecompiledContract(precompiled: IPrecompiledContract, contract: Contract, input: Buffer): Promise<InterpreterResult> {
        let returnData = Buffer.alloc(0);
        let error: Error;

        try {
            returnData = precompiled(this, contract, input);
        } catch (precompiledError) {
            error = precompiledError;
        }

        return {
            returnData,
            error
        };
    }

    // TODO
    async call(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint, value: bigint): Promise<VMCallResult> {
        if (this.depth > this.config.params.CallCreateDepth) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new TransitionError(ERROR.INSUFFICIENT_BALANCE) };
        }

        const to = this.accountRef(address);
        const snapshot = this.storage.snapshot();

        if (!this.storage.exist(address)) {
            if (!this.getPrecompiledContract(address) && value === 0n) {
                return { returnData: Buffer.alloc(0), leftOverGas: gas };
            }
            this.storage.createAccount(address);
        }

        this.context.transfer(this.storage, caller.address, to.address, value);

        const contract = new Contract(caller, to, value, gas);
        contract.setCallCode(address, this.storage.getCode(address));

        const { returnData, error } = await this.run(contract, input);

        if (error) {
            this.storage.revertToSnapshot(snapshot);
            if (!isExecutionReverted(error)) {
                contract.useGas(contract.gas);
            }
        }

        return {
            returnData,
            leftOverGas: contract.gas,
            error
        };
    }

    // TODO
    async callCode(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint, value: bigint): Promise<VMCallResult> {
        if (this.depth > this.config.params.CallCreateDepth) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new TransitionError(ERROR.INSUFFICIENT_BALANCE) };
        }

        const to = this.accountRef(caller.address);
        const snapshot = this.storage.snapshot();

        const contract = new Contract(caller, to, value, gas);
        contract.setCallCode(address, this.storage.getCode(address));

        const { returnData, error } = await this.run(contract, input);

        if (error) {
            this.storage.revertToSnapshot(snapshot);
            if (!isExecutionReverted(error)) {
                contract.useGas(contract.gas);
            }
        }

        return {
            returnData,
            leftOverGas: contract.gas,
            error
        };
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

        const { returnData, error } = await this.run(contract, input);

        if (error) {
            this.storage.revertToSnapshot(snapshot);
            if (!isExecutionReverted(error)) {
                contract.useGas(contract.gas);
            }
        }

        return {
            returnData,
            leftOverGas: contract.gas,
            error
        };
    }

    async staticCall(caller: ContractRef, address: Buffer, input: Buffer, gas: bigint): Promise<VMCallResult> {
        if (this.depth > this.config.params.CallCreateDepth) {
            return { returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        const to = this.accountRef(caller.address);
        const snapshot = this.storage.snapshot();

        const contract = new Contract(caller, to, null, gas).asDelegate();
        contract.setCallCode(address, this.storage.getCode(address));

        // TODO
        this.storage.addBalance(address, 0n);

        const { returnData, error } = await this.run(contract, input, true);

        if (error) {
            this.storage.revertToSnapshot(snapshot);
            if (!isExecutionReverted(error)) {
                contract.useGas(contract.gas);
            }
        }

        return {
            returnData,
            leftOverGas: contract.gas,
            error
        };
    }

    private async createContract(caller: ContractRef, code: Buffer, gas: bigint, value: bigint, address: Buffer): Promise<VMCreateResult> {
        if (this.depth > this.config.params.CallCreateDepth) {
            return { contractAddress: null, returnData: Buffer.alloc(0), leftOverGas: gas, error: new VmError(ERROR.DEPTH) };
        }

        if (!this.context.canTransfer(this.storage, caller.address, value)) {
            return { contractAddress: null, returnData: Buffer.alloc(0), leftOverGas: gas, error: new TransitionError(ERROR.INSUFFICIENT_BALANCE) };
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

        let { returnData, error: createError } = await this.run(contract, null);

        try {

            if (createError) {
                throw createError;
            }

            if (returnData.length > this.config.params.MaxCodeSize) {
                throw new Error(ERROR.MAX_CODE_SIZE_EXCEEDED);
            }

            const createDataGas = BigInt(returnData.length) * this.config.params.CreateDataGas;

            contract.useGas(createDataGas);

            this.storage.setCode(address, returnData);

        } catch (error) {
            createError = error;
        }

        if (createError) {
            this.storage.revertToSnapshot(snapshot);
            if (!isExecutionReverted(createError)) {
                contract.useGas(contract.gas);
            }
        }

        return {
            contractAddress: address,
            returnData,
            leftOverGas: contract.gas,
            error: createError
        };
    }

    async create(caller: ContractRef, code: Buffer, gas: bigint, value: bigint): Promise<VMCreateResult> {
        const contractAddress = this.config.createAddress(caller.address, this.storage.getNonce(caller.address));
        return this.createContract(caller, code, gas, value, contractAddress);
    }        


    async create2(caller: ContractRef, code: Buffer, gas: bigint, endowment: bigint, salt: bigint): Promise<VMCreateResult> {
        const contractAddress = this.config.createAddressWithSalt(caller.address, salt, code);
        return this.createContract(caller, code, gas, endowment, contractAddress);
    }        
}
