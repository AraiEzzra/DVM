import { IContext } from 'src/IContext';
import { EnvJSON, ExecJSON } from 'test/vm/VmJSON';
import { hexToBuffer, hexToBigInt } from 'test/helpers';

export class TestContext implements IContext {

    currentCoinbase: Buffer;
    currentDifficulty: Buffer;
    currentGasLimit: bigint;
    currentNumber: bigint;
    currentTimestamp: bigint;
    previousHash: Buffer;

    address: Buffer;
    origin: Buffer;
    caller: Buffer;
    value: Buffer;
    data: Buffer;
    code: Buffer;
    gasPrice: bigint;
    gas: bigint;

    constructor(env: EnvJSON = <EnvJSON>{}, exec: ExecJSON = <ExecJSON>{}) {
        this.currentCoinbase = hexToBuffer(env.currentCoinbase);
        this.currentDifficulty = hexToBuffer(env.currentDifficulty);
        this.currentGasLimit = hexToBigInt(env.currentGasLimit);
        this.currentNumber = hexToBigInt(env.currentNumber);
        this.currentTimestamp = hexToBigInt(env.currentTimestamp);
        
        this.address = hexToBuffer(exec.address);
        this.origin = hexToBuffer(exec.origin);
        this.caller = hexToBuffer(exec.caller);
        this.value = hexToBuffer(exec.value);
        this.data = hexToBuffer(exec.data);
        this.code = hexToBuffer(exec.code);
        this.gasPrice = hexToBigInt(exec.gasPrice);
        this.gas = hexToBigInt(exec.gas);
    }
}
