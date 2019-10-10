export interface IStorage {
    subBalance(address: Buffer, value: bigint);
    getBalance(address: Buffer): bigint;
    addBalance(address: Buffer, value: bigint);

    getNonce(address: Buffer): bigint;
    setNonce(address: Buffer, value: bigint);

    getCode(address: Buffer): Buffer;

    getValue(address: Buffer, key: Buffer): Buffer;
    setValue(address: Buffer, key: Buffer, value: Buffer): void;
    size: number;
    toString(): string;
}
