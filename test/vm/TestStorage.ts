import { IStorage } from 'src/IStorage';
import { hexToBuffer } from 'test/helpers';
import { AccountJSON } from 'test/vm/VmJSON';
import { MerklePatriciaTree } from 'test/vm/MerklePatriciaTree';
import * as rlp from 'rlp';
import { keccak256 } from 'src/interpreter/hash';
import { bigIntToBuffer } from 'src/interpreter/utils';

export type Account = {
    address: Buffer;
    code: Buffer;
    nonce: bigint;
    balance: bigint;
    storage: Map<string, Buffer>;
};

export class TestStorage implements IStorage {

    readonly data: Map<string, Account>;

    constructor(data: {[address: string]: AccountJSON} = {}) {
        this.data = new Map();

        Object.entries(data).forEach(([key, value]) => this.putAccount(key, value));
    }

    private putAccount(key: string, value: AccountJSON) {
        const address = hexToBuffer(key);

        const storage: Array<[string, Buffer]> = Object.entries(value.storage).map(([storageKey, storageValue]) => {
            return [
                hexToBuffer(storageKey, 32).toString('hex'),
                hexToBuffer(storageValue)
            ];
        });

        const account: Account = {
            address,
            code: hexToBuffer(value.code),
            nonce: BigInt(value.nonce),
            balance: BigInt(value.balance),
            storage: new Map(storage)
        };

        this.data.set(address.toString('hex'), account);
    }

    private getAccount(address: Buffer): Account {
        const key = address.toString('hex');
        return this.data.get(key);
    }

    private getOrNewAccount(address: Buffer): Account {
        const key = address.toString('hex');

        if (!this.data.has(key)) {
            this.data.set(key, {
                address,
                code: Buffer.alloc(0),
                nonce: 0n,
                balance: 0n,
                storage: new Map()
            });
        }

        return this.data.get(key);
    }

    getBalance(address: Buffer): bigint {
        const account = this.getAccount(address);
        if (account) {
            return account.balance;
        }
        return 0n;
    }

    subBalance(address: Buffer, value: bigint) {
        const account = this.getAccount(address);
        if (account) {
            account.balance -= value;
        }
    }

    addBalance(address: Buffer, value: bigint) {
        this.getOrNewAccount(address).balance += value;
    }

    getNonce(address: Buffer): bigint {
        const account = this.getAccount(address);
        if (account) {
            return account.nonce;
        }
        return 0n;
    }

    setNonce(address: Buffer, value: bigint) {
        this.getOrNewAccount(address).nonce = value;
    }

    getCode(address: Buffer): Buffer {
        const account = this.getAccount(address);
        if (account) {
            return account.code;
        }
        return Buffer.alloc(0);
    }

    get size(): number {
        return 0;
    }

    getValue(address: Buffer, key: Buffer): Buffer {
        const account = this.getAccount(address);
        const hex = key.toString('hex');

        if (account && account.storage.has(hex)) {
            return account.storage.get(hex);
        }
        return Buffer.alloc(0);
    }

    setValue(address: Buffer, key: Buffer, value: Buffer) {
        const account = this.getOrNewAccount(address);

        if (value.length === 0) {
            account.storage.delete(key.toString('hex'));
        } else {
            account.storage.set(key.toString('hex'), value);
        }
    }

    async toMerklePatriciaTree(): Promise<MerklePatriciaTree> {
        const tree = new MerklePatriciaTree();

        const accounts = [...this.data.values()].map(async item => {
            const codeHash = keccak256(item.code);
            const storageTrie = tree.copy();

            storageTrie.root = null;

            const storage = [...item.storage.entries()].map(async ([key, value]) => {
                return await storageTrie.put(
                    Buffer.from(key, 'hex'),
                    rlp.encode(value)
                );
            });

            await Promise.all(storage);

            await tree.putRaw(codeHash, item.code);

            const serialize = rlp.encode([
                bigIntToBuffer(item.nonce),
                bigIntToBuffer(item.balance),
                storageTrie.root,
                codeHash
            ]);
    
            await tree.put(item.address, serialize);
        });

        await Promise.all(accounts);

        return tree;
    }

    toString(): string {
        return '';
    }
}
