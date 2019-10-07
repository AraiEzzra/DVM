export type Address = string;

export interface IStorage {
    getValue(address: Address, key: Buffer): Buffer;
    setValue(address: Address, key: Buffer, value: Buffer): void;
    size: number;
    toString(): string;
}
