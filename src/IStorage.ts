import { Log } from 'src/Log';

export interface IStorage {
    createAccount(address: Buffer): void;

    subBalance(address: Buffer, value: bigint): void;
    getBalance(address: Buffer): bigint;
    addBalance(address: Buffer, value: bigint): void;

    getNonce(address: Buffer): bigint;
    setNonce(address: Buffer, value: bigint): void;

    getCode(address: Buffer): Buffer;
    setCode(address: Buffer, code: Buffer): void;
    getCodeSize(address: Buffer): bigint;

    getValue(address: Buffer, key: Buffer): Buffer;
    setValue(address: Buffer, key: Buffer, value: Buffer): void;

    snapshot(): any;
    revertToSnapshot(value: any): void;

    // Exist reports whether the given account exists in state.
	// Notably this should also return true for suicided accounts.
    exist(address: Buffer): boolean;

    // Empty returns whether the given account is empty. Empty
	// is defined according to EIP161 (balance = nonce = code = 0).
    empty(address: Buffer): boolean;

    suicide(address: Buffer): void;
    hasSuicided(address: Buffer): boolean;

    addRefund(gas: bigint): void;
	subRefund(gas: bigint): void
	getRefund(): bigint;

    addLog(log: Log): void;
    logs(): Array<Log>;
}
