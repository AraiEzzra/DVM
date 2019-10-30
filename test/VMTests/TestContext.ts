import { IContext } from 'src/IContext';
import { IStorage } from 'src/IStorage';
import { TestJSON } from 'test/VMTests/TestsJSON';
import { hexToBuffer, hexToBigInt } from 'test/utils';

export class TestContext implements IContext {
    blockNumber: bigint;
    coinbase: Buffer;
    difficulty: bigint;
    gasLimit: bigint;
    gasPrice: bigint;
    origin: Buffer;
    time: bigint;

    private initialCall: boolean;

    constructor(test: TestJSON) {
        this.blockNumber = hexToBigInt(test.env.currentNumber);
        this.coinbase = hexToBuffer(test.env.currentCoinbase);
        this.difficulty = hexToBigInt(test.env.currentDifficulty);
        this.gasLimit = hexToBigInt(test.env.currentGasLimit);
        this.gasPrice = hexToBigInt(test.exec.gasPrice);
        this.origin = hexToBuffer(test.exec.origin);
        this.time = hexToBigInt(test.env.currentTimestamp);

        this.initialCall = true;
    }

    canTransfer(storage: IStorage, address: Buffer, amount: bigint): boolean {
        if (this.initialCall) {
            this.initialCall = false;
            return true;
        }
        return storage.getBalance(address) >= amount;
    }

    transfer(storage: IStorage, sender: Buffer, recipient: Buffer, amount: bigint) {}
}
