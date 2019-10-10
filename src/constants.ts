export const STACK_MAX_SIZE = 1024;

export class GAS {
    static ZeroGas = 0n;
    static BaseGas = 2n;
    static VeryLowGas = 3n;
    static LowGas = 5n;
    static MidGas = 8n;
    static HighGas = 10n;
    static ExtGas = 20n;
    static ExpByteGas      = 10n;
    static ExpGas          = 10n; // Once per EXP instruction
    static SloadGasFrontier = 50n;
    static SstoreSetGas    = 20000n; // Once per SLOAD operation.
    static SstoreResetGas  = 5000n;  // Once per SSTORE operation if the zeroness changes from zero.
    static SstoreClearGas  = 5000n;  // Once per SSTORE operation if the zeroness doesn't change.
    static SstoreRefundGas = 15000n; // Once per SSTORE operation if the zeroness changes to zero.
    static QuadCoeffDiv = 512n;   // Divisor for the quadratic particle of the memory cost equation.
    static MemoryGas = 3n;
    static JumpdestGas = 1n; // Once per JUMPDEST operation.

    static Sha3Gas = 30n; // Once per SHA3 operation.
    static Sha3WordGas = 6n;  // Once per word of the SHA3 operation's data.
    static CopyGas = 3n;

    static LogGas = 375n; // Per LOG* operation.
    static LogTopicGas = 375n; // Multiplied by the * of the LOG*, per LOG transaction. e.g.
                               // LOG0 incurs 0 * c_txLogTopicGas, LOG4 incurs 4 * c_txLogTopicGas.
    static LogDataGas = 8n; // Per byte in a LOG* operation's data.
    static BalanceGasFrontier = 400n; // The cost of a BALANCE operation
}
