import { IContext } from 'src/IContext';
import { IStorage } from 'src/IStorage';
import { Message } from 'src/Message';
import { TestJSON } from 'test/GeneralStateTests/TestsJSON';
import { hexToBuffer, hexToBigInt } from 'test/utils';

export class TestContext implements IContext {
    blockNumber: bigint;
    coinbase: Buffer;
    difficulty: bigint;
    gasLimit: bigint;
    gasPrice: bigint;
    origin: Buffer;
    time: bigint;

    constructor(message: Message, test: TestJSON) {
        this.blockNumber = hexToBigInt(test.env.currentNumber);
        this.coinbase = hexToBuffer(test.env.currentCoinbase);
        this.difficulty = hexToBigInt(test.env.currentDifficulty);
        this.gasLimit = hexToBigInt(test.env.currentGasLimit);
        this.gasPrice = message.gasPrice;
        this.origin = message.from;
        this.time = hexToBigInt(test.env.currentTimestamp);
    }

    canTransfer(storage: IStorage, address: Buffer, amount: bigint): boolean {
        return storage.getBalance(address) >= amount;
    }

    transfer(storage: IStorage, sender: Buffer, recipient: Buffer, amount: bigint) {
        storage.subBalance(sender, amount);
        storage.addBalance(recipient, amount);
    }
}
