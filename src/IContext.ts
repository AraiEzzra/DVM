export interface IContext {
    // The current block's coinbase address, to be returned by the COINBASE instruction.
    currentCoinbase: Buffer;

    // The current block's difficulty, to be returned by the DIFFICULTY instruction.
    currentDifficulty: Buffer;

    // The current block's gas limit.
    currentGasLimit: bigint;

    // The current block's number.
    currentNumber: bigint;

    // The current block's timestamp.
    currentTimestamp: bigint;

    // The previous block's hash.
    previousHash: Buffer;

    // The address of the account under which the code is executing, to be returned by the ADDRESS instruction.
    address: Buffer;

     // The address of the execution's origin, to be returned by the ORIGIN instruction.
    origin: Buffer;

    // The address of the execution's caller, to be returned by the CALLER instruction.
    caller: Buffer;

    // The value of the call (or the endowment of the create), to be returned by the CALLVALUE instruction.
    value: Buffer;

    // The input data passed to the execution, as used by the CALLDATA... instructions.
    // Given as an array of byte values. See $DATA_ARRAY.
    data: Buffer;

    // The actual code that should be executed on the VM (not the one stored in the state(address)) . See $DATA_ARRAY.
    code: Buffer;

    // The price of gas for the transaction, as used by the GASPRICE instruction.
    gasPrice: bigint;

    // The total amount of gas available for the execution, as would be returned by the GAS
    // instruction were it be executed first.
    gas: bigint;
}
