import { IStorage } from 'src/IStorage';

export interface IContext {
    // CanTransfer returns whether the account contains
    // sufficient ether to transfer the value
    canTransfer(storage: IStorage, address: Buffer, amount: bigint): boolean;
    // Transfer transfers ether from one account to the other
    transfer(storage: IStorage, sender: Buffer, recipient: Buffer, amount: bigint): void;
    // Message information
    origin: Buffer;   // Provides information for ORIGIN
    gasPrice: bigint; // Provides information for GASPRICE

    // Block information
    coinbase: Buffer;    // Provides information for COINBASE
    gasLimit: bigint;    // Provides information for GASLIMIT
    blockNumber: bigint; // Provides information for NUMBER
    time: bigint;        // Provides information for TIME
    difficulty: bigint;  // Provides information for DIFFICULTY
}
