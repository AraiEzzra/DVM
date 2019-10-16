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

    getValue(address: Buffer, key: Buffer): Buffer;
    setValue(address: Buffer, key: Buffer, value: Buffer): void;

    snapshot(): any;
    revertToSnapshot(value: any): void;

    exist(address: Buffer): boolean;

    suicide(address: Buffer): void;

    addLog(log: Log): void;

    logs(): Array<Log>;
}
