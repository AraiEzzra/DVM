import { IContext } from 'src/IContext';
import { EnvJSON, EmptyEnvJSON, ExecJSON, EmptyExecJSON } from 'test/vm/VmJSON';
import { hexToBuffer } from 'test/vm';

export class TestContext implements IContext {

    currentCoinbase: bigint;
    currentDifficulty: bigint;
    currentGasLimit: bigint;
    currentNumber: bigint;
    currentTimestamp: bigint;
    previousHash: bigint;

    address: Buffer;
    origin: Buffer;
    caller: Buffer;
    value: Buffer;
    data: Buffer;
    code: Buffer;
    gasPrice: bigint;
    gas: bigint;

    constructor(env: EnvJSON = EmptyEnvJSON, exec: ExecJSON = EmptyExecJSON) {
        this.currentCoinbase = BigInt(env.currentCoinbase);
        this.currentDifficulty = BigInt(env.currentDifficulty);
        this.currentGasLimit = BigInt(env.currentGasLimit);
        this.currentNumber = BigInt(env.currentNumber);
        this.currentTimestamp = BigInt(env.currentTimestamp);
        
        this.address = hexToBuffer(exec.address);
        this.origin = hexToBuffer(exec.origin);
        this.caller = hexToBuffer(exec.caller);
        this.value = hexToBuffer(exec.value);
        this.data = hexToBuffer(exec.data);
        this.code = hexToBuffer(exec.code);
        this.gasPrice = BigInt(exec.gasPrice);
        this.gas = BigInt(exec.gas);
    }
}
