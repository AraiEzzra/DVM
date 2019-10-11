export interface IStorage {
    createAccount(address: Buffer);

    subBalance(address: Buffer, value: bigint);
    getBalance(address: Buffer): bigint;
    addBalance(address: Buffer, value: bigint);

    getNonce(address: Buffer): bigint;
    setNonce(address: Buffer, value: bigint);

    getCode(address: Buffer): Buffer;
    setCode(address: Buffer, code: Buffer);

    getValue(address: Buffer, key: Buffer): Buffer;
    setValue(address: Buffer, key: Buffer, value: Buffer): void;


    snapshot(): any;
    revertToSnapshot(value: any);

    exist(address: Buffer): boolean;

    suicide(address: Buffer);

    size: number;
    toString(): string;

    // TODO
    addLog(log: any);
}
