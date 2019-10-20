import { VmStop, VmError, ERROR } from 'src/interpreter/exceptions';
import { IContext } from 'src/IContext';

// TODO
export type Result = {
    value?: Buffer;
};

// https://github.com/ewasm/design/blob/master/eth_interface.md
// TODO move this logic to context
export class EEI {

    context: IContext;
    gasLimit: bigint;
    gasLeft: bigint;
    result: Result;

    constructor(context: IContext) {
        this.context = context;
        this.result = {
            value: Buffer.alloc(0)
        };
        this.gasLimit = context.gas;
        this.gasLeft = context.gas;
    }

    useGas(amount: bigint) {
        this.gasLeft -= amount;
        if (this.gasLeft < 0) {
            this.gasLeft = 0n;
            throw new VmError(ERROR.OUT_OF_GAS);
        }
    }

    getTxGasPrice(): bigint {
        return this.context.gasPrice;
    }

    getTxOrigin(): Buffer {
        return this.context.origin;
    }

    getCode(): Buffer {
        return this.context.code;
    }

    getCodeSize(): bigint {
        return BigInt(this.context.code.length);
    }

    getCallDataSize(): bigint {
        return this.context.data.length === 1 && this.context.data[0] === 0
            ? 0n
            : BigInt(this.context.data.length);
    }

    getCallData(): Buffer {
        return this.context.data;
    }

    getCallValue(): Buffer {
        return this.context.value;
    }

    getAddress(): Buffer {
        return this.context.address;
    }

    getCaller(): Buffer {
        return this.context.caller;
    }

    getBlockNumber(): bigint {
        return this.context.currentNumber;
    }

    getBlockCoinbase(): Buffer {
        return this.context.currentCoinbase;
    }

    getBlockTimestamp(): bigint {
        return this.context.currentTimestamp;
    }

    getBlockDifficulty(): Buffer {
        return this.context.currentDifficulty;
    }

    getBlockGasLimit(): bigint {
        return this.context.currentGasLimit;
    }

    getGasLeft(): bigint {
        return this.gasLeft;
    }

    finish(value: Buffer = Buffer.alloc(0)) {
        this.result.value = value;
        throw new VmStop();
    }

    log(data: Buffer, numberOfTopics: number, topics: Buffer[]) {
        // TODO
    }
}
