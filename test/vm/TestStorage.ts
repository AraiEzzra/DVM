import { IStorage } from 'src/IStorage';
import { hexToBuffer } from 'test/helpers';
import { AccountJSON } from 'test/GeneralStateTests/TestsJSON';
import { MerklePatriciaTree } from 'test/vm/MerklePatriciaTree';
import * as rlp from 'rlp';
import { keccak256 } from 'src/interpreter/hash';
import { bigIntToBuffer } from 'src/interpreter/utils';
import { Log } from 'src/Log';

export type Account = {
    address: Buffer;
    code: Buffer;
    nonce: bigint;
    balance: bigint;
    suicided: boolean;
    storage: Map<string, Buffer>;
};

export class TestStorage implements IStorage {

    private data: Map<string, Account>;

    private touched: Set<string>;

    private logList: Array<Log>;

    private refund: bigint;

    constructor(data: {[address: string]: AccountJSON} = {}) {
        this.data = new Map();
        this.touched = new Set();
        this.logList = [];
        this.refund = 0n;

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
            suicided: false,
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

    snapshot() {
        return new Map([...this.data.entries()].map(([key, item]) => {
            const cloneItem = { ...item, storage: new Map(item.storage) };
            return [key, cloneItem];
        }));
    }
        
    revertToSnapshot(value: any) {
        this.data = value;
    }

    createAccount(address: Buffer) {
        const key = address.toString('hex');
        
        this.putAccount(key, {
            code: '',
            balance: '',
            nonce: '',
            storage: {}
        });
    }

    setCode(address: Buffer, code: Buffer) {
        this.getOrNewAccount(address).code = code;
    }

    exist(address: Buffer): boolean {
        const key = address.toString('hex');
        return this.data.has(key);
    }

    empty(address: Buffer): boolean {
        const account = this.getAccount(address);
        if (account) {
            return account.nonce === 0n
                && account.balance === 0n
                && account.code.length === 0
                && account.storage.size === 0;
        }
        return true;
    }

    suicide(address: Buffer) {
        const account = this.getAccount(address);
        if (account) {
            account.suicided = true;
        }
    }

    hasSuicided(address: Buffer): boolean {
        const account = this.getAccount(address);
        if (account) {
            return account.suicided;
        }
        return false;
    }

    private getOrNewAccount(address: Buffer): Account {
        const key = address.toString('hex');

        this.touched.add(key);

        if (!this.data.has(key)) {
            this.createAccount(address);
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

    getCodeSize(address: Buffer): bigint {
        const account = this.getAccount(address);
        if (account) {
            return BigInt(account.code.length);
        }
        return 0n;
    }

    getCodeHash(address: Buffer): Buffer {
        const account = this.getAccount(address);
        if (account) {
            return keccak256(account.code);
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

    getData(): Array<Account> {
        return [...this.data.values()]
            .filter(item => !(this.empty(item.address) || this.hasSuicided(item.address)));
            // .filter(item => this.touched.has(item.address.toString('hex')) && !(this.empty(item.address) || this.hasSuicided(item.address)));
    } 

    async toMerklePatriciaTree(): Promise<MerklePatriciaTree> {
        const tree = new MerklePatriciaTree();

        for (const item of this.getData()) {
            const codeHash = keccak256(item.code);
            const storageTrie = tree.copy();

            storageTrie.root = null;

            for (const [key, value] of item.storage.entries()) {
                await storageTrie.put(
                    Buffer.from(key, 'hex'),
                    rlp.encode(value)
                );
            }

            await tree.putRaw(codeHash, item.code);

            const serialize = rlp.encode([
                bigIntToBuffer(item.nonce),
                bigIntToBuffer(item.balance),
                storageTrie.root,
                codeHash
            ]);
    
            await tree.put(item.address, serialize);
        }

        return tree;
    }

    addRefund(gas: bigint) {
        this.refund += gas;
    }

    subRefund(gas: bigint) {
        if (gas > this.refund) {
            throw new Error('Refund counter below zero');
        }        
        this.refund -= gas;
    }
    
    getRefund(): bigint {
        return this.refund;
    }

    addLog(log: Log) {
        this.logList.push(log);
    }

    logs(): Array<Log> {
        return this.logList;
    }

    print() {
        const foo: any = {};

        for (let account of this.getData()) {
            const address = account.address.toString('hex');
            foo[address] = {
                address,
                balance: account.balance,
                nonce: account.nonce
              };

              foo[address]['storage'] = account.storage;
        }

        const accounts: Array<any> =  Object.values(foo).sort((x: any, y: any) => x.address.localeCompare(y.address))
        for (let account of accounts) {
          console.log('--------------------------------------');
          console.log('address', account.address);
          console.log('balance', account.balance);
          console.log('nonce', account.nonce);
          [...account.storage.entries()]
              .map(([key, value]) => ({key, value}))
              .sort((x, y) => x.key.localeCompare(y.key))
              .forEach(item => {
                console.log(`${item.key}: ${item.value.toString('hex')}`);
              })
        }
  
    }
}
