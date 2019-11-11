# Stack machine

Typescript implementation [Ethereum Virtual Machine (EVM)](https://github.com/ethereum/wiki/wiki/Ethereum-Virtual-Machine-(EVM)-Awesome-List)

Stack-based virtual machine with an ephemeral memory byte-array and persistent key-value storage.
Elements on the stack are 32-byte words, and all keys and values in storage are 32 bytes.
There are over [100 opcodes](src/interpreter/OpCode.ts)

## Blockchain integration

#### Implementation Blockchain Context

```typescript
interface IContext {
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
```

#### Implementation Blockchain Storage

```typescript
interface IStorage {
    createAccount(address: Buffer): void;

    subBalance(address: Buffer, value: bigint): void;
    getBalance(address: Buffer): bigint;
    addBalance(address: Buffer, value: bigint): void;

    getNonce(address: Buffer): bigint;
    setNonce(address: Buffer, value: bigint): void;

    getCode(address: Buffer): Buffer;
    setCode(address: Buffer, code: Buffer): void;
    getCodeSize(address: Buffer): bigint;
    getCodeHash(address: Buffer): Buffer;
    
    getValue(address: Buffer, key: Buffer): Buffer;
    setValue(address: Buffer, key: Buffer, value: Buffer): void;

    snapshot(): number;
    revertToSnapshot(value: number): void;

    // Exist reports whether the given account exists in state.
    // Notably this should also return true for suicided accounts.
    exist(address: Buffer): boolean;

    // Empty returns whether the given account is empty. Empty
    // is defined according to EIP161 (balance = nonce = code = 0).
    empty(address: Buffer): boolean;

    suicide(address: Buffer): void;
    hasSuicided(address: Buffer): boolean;

    addRefund(gas: bigint): void;
    subRefund(gas: bigint): void;
    getRefund(): bigint;

    addLog(log: Log): void;
    logs(): Array<Log>;
```

#### Implementation Blockchain Config

```typescript
type Config = {
    debug: boolean;
    params?: Params;
    precompiles?: {
        [byte: number]: IPrecompiledContract
    };
    bigIntToAddress(b: bigint): Buffer;
    createAddress(address: Buffer, nonce: bigint): Buffer;
    createAddressWithSalt(address: Buffer, solt: bigint, code: Buffer): Buffer;
    getBlockHash(n: number): Buffer;
};
```
Also you can add your Precompiled Contract, and change the cost of gas

## Run

```typescript
    const storage = new Storage();
    const context = new Context();
    const vm = new VM(context, storage, config);
    const gasPool = new GasPool(context.gasLimit);

    const snapshot = storage.snapshot();

    const result = await vm.applyMessage(message, gasPool);

    if (result.error) {
        storage.revertToSnapshot(snapshot);
    }
```
## Tests

```bash
npm run test
```

