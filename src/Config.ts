import { IPrecompiledContract } from 'src/Contract';
import { ecrecover } from 'src/precompiles/ecrecover';

export type Config = {
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

export type Params = Partial<typeof PARAMS>;

export const PARAMS = {
    StackLimit: 1024,  // Maximum size of VM stack allowed.

    ZeroGas: 0n,
    BaseGas: 2n,
    VeryLowGas: 3n,
    LowGas: 5n,
    MidGas: 8n,
    HighGas: 10n,
    ExtGas: 20n,
    ExpByteGas     : 50n,
    ExpGas         : 10n, // Once per EXP instruction
    SloadGas: 200n,
    SstoreSetGas   : 20000n, // Once per SLOAD operation.
    SstoreResetGas : 5000n,  // Once per SSTORE operation if the zeroness changes from zero.
    SstoreClearGas : 5000n,  // Once per SSTORE operation if the zeroness doesn't change.
    SstoreRefundGas: 15000n, // Once per SSTORE operation if the zeroness changes to zero.
    QuadCoeffDiv: 512n,   // Divisor for the quadratic particle of the memory cost equation.
    MemoryGas: 3n,
    JumpdestGas: 1n, // Once per JUMPDEST operation.
    
    Sha3Gas: 30n, // Once per SHA3 operation.
    Sha3WordGas: 6n,  // Once per word of the SHA3 operation's data.
    CopyGas: 3n,
    
    LogGas: 375n, // Per LOG* operation.
    LogTopicGas: 375n, // Multiplied by the * of the LOG*, per LOG transaction. e.g.
                               // LOG0 incurs 0 * c_txLogTopicGas, LOG4 incurs 4 * c_txLogTopicGas.
    LogDataGas: 8n, // Per byte in a LOG* operation's data.
    BalanceGas: 400n, // The cost of a BALANCE operation
    CallCreateDepth: 1024, // Maximum depth of call/create stack.
    
    TxGas: 21000n, // Per transaction not creating a contract.
                           // NOTE: Not payable on data of calls between transactions.
    
    TxGasContractCreation: 53000n, // Per transaction that creates a contract. NOTE: Not payable on data of calls between transactions.
    
    TxDataZeroGas: 4n, // Per byte of data attached to a transaction that equals zero.
                               // NOTE: Not payable on data of calls between transactions.
    
    TxDataNonZeroGas: 68n, // Per byte of data attached to a transaction that is not equal to zero.
    // NOTE: Not payable on data of calls between transactions.
    
    CallGas: 700n,  // Once per CALL operation & message call transaction.
    CallValueTransferGas: 9000n, // Paid for CALL when the value transfer is non-zero.
    CallNewAccountGas: 25000n, // Paid for CALL when the destination address didn't exist prior.
    CallStipend: 2300n, // Free gas given at beginning of call.
    ExtcodeSizeGas: 700n, // Cost of EXTCODESIZE
    ExtcodeCopyBase: 700n,
    
    EcrecoverGas: 3000n, // Elliptic curve sender recovery gas price
    
    MaxCodeSize: 24576, // Maximum bytecode to permit for a contract
    
    CreateDataGas: 200n,
    CreateGas: 32000n, // Once per CREATE operation & contract-creation transaction.
    Create2Gas: 32000n, // Once per CREATE2 operation
    
    SelfdestructGas: 5000n, // Cost of SELFDESTRUCT post EIP 150 (Tangerine)
    
    // CreateBySelfdestructGas is used when the refunded account is one that does
    // not exist. This logic is similar to call.
    // Introduced in Tangerine Whistle (Eip 150)
    CreateBySelfdestructGas: 25000n,
    
    SelfdestructRefundGas: 24000n, // Refunded following a selfdestruct operation.

    ExtcodeHashGas: 400n  // Cost of EXTCODEHASH
};

export const PRECOMPILES = {
    0x01: ecrecover
};
