export enum OpCode {
    // halts execution
    STOP = 0x00,
    // addition operation
    ADD = 0x01,
    // mulitplication operation
    MUL = 0x02,
    // subtraction operation
    SUB = 0x03,
    // integer division operation
    DIV = 0x04,
    // signed integer division operation
    SDIV = 0x05,
    // modulo remainder operation
    MOD = 0x06,
    // signed modulo remainder operation
    SMOD = 0x07,
    // unsigned modular addition
    ADDMOD = 0x08,
    // unsigned modular multiplication
    MULMOD = 0x09,
    // exponential operation
    EXP = 0x0a,
    // extend length of signed integer
    SIGNEXTEND = 0x0b,

    // less-than comparision
    LT = 0x10,
    // greater-than comparision
    GT = 0x11,
    // signed less-than comparision
    SLT = 0x12,
    // signed greater-than comparision
    SGT = 0x13,
    // equality comparision
    EQ = 0x14,
    // simple not operator
    ISZERO = 0x15,
    // bitwise AND operation
    AND = 0x16,
    // bitwise OR operation
    OR = 0x17,
    // bitwise XOR operation
    XOR = 0x18,
    // bitwise NOT opertation
    NOT = 0x19,
    // retrieve single byte from word
    BYTE = 0x1a,
    // shift left operation
    SHL = 0x1b,
    // logical shift right operation
    SHR = 0x1c,
    // arithmetic shift right operation
    SAR = 0x1d,

    // compute SHA3-256 hash
    SHA3 = 0x20,

    // get address of currently executing account
    ADDRESS = 0x30,
    // get balance of the given account
    BALANCE = 0x31,
    // get execution origination address
    ORIGIN = 0x32,
    // get caller address
    CALLER = 0x33,
    // get deposited value by the instruction/transaction responsible for this execution
    CALLVALUE = 0x34,
    // get input data of current environment
    CALLDATALOAD = 0x35,
    // get size of input data in current environment
    CALLDATASIZE = 0x36,
    // copy input data in current environment to memory
    CALLDATACOPY = 0x37,
    // get size of code running in current environment
    CODESIZE = 0x38,
    // copy code running in current environment to memory
    CODECOPY = 0x39,
    // get price of gas in current environment
    GASPRICE = 0x3a,
    // get external code size (from another contract)
    EXTCODESIZE = 0x3b,
    // copy external code (from another contract)
    EXTCODECOPY = 0x3c,
    // get the size of the return data buffer for the last call
    RETURNDATASIZE = 0x3d,
    // copy return data buffer to memory
    RETURNDATACOPY = 0x3e,
    // return the keccak256 hash of contract code
    EXTCODEHASH = 0x3f,

    // get hash of most recent complete block
    BLOCKHASH = 0x40,
    // get the block's coinbase address
    COINBASE = 0x41,
    // get the block's timestamp
    TIMESTAMP = 0x42,
    // get the block's number
    NUMBER = 0x43,
    // get the block's difficulty
    DIFFICULTY = 0x44,
    // get the block's gas limit
    GASLIMIT = 0x45,
    // get chain ID
    CHAINID = 0x46,
    // get balance of own account
    SELFBALANCE = 0x47,

    // remove item from stack
    POP = 0x50,
    // load word from memory
    MLOAD = 0x51,
    // save word to memory
    MSTORE = 0x52,
    // save byte to memory
    MSTORE8 = 0x53,
    // load word from storage
    SLOAD = 0x54,
    // save word to storage
    SSTORE = 0x55,
    // alter the program counter
    JUMP = 0x56,
    // conditionally alter the program counter
    JUMPI = 0x57,
    // get the program counter
    PC = 0x58,
    // get the size of active memory
    MSIZE = 0x59,
    // get the amount of available gas
    GAS = 0x5a,
    // set a potential jump destination
    JUMPDEST = 0x5b,

    // place 1 byte item on stack
    PUSH1 = 0x60,
    // place 2 byte item on stack
    PUSH2 = 0x61,
    // place 3 byte item on stack
    PUSH3 = 0x62,
    // place 4 byte item on stack
    PUSH4 = 0x63,
    // place 5 byte item on stack
    PUSH5 = 0x64,
    // place 6 byte item on stack
    PUSH6 = 0x65,
    // place 7 byte item on stack
    PUSH7 = 0x66,
    // place 8 byte item on stack
    PUSH8 = 0x67,
    // place 9 byte item on stack
    PUSH9 = 0x68,
    // place 10 byte item on stack
    PUSH10 = 0x69,
    // place 11 byte item on stack
    PUSH11 = 0x6a,
    // place 12 byte item on stack
    PUSH12 = 0x6b,
    // place 13 byte item on stack
    PUSH13 = 0x6c,
    // place 14 byte item on stack
    PUSH14 = 0x6d,
    // place 15 byte item on stack
    PUSH15 = 0x6e,
    // place 16 byte item on stack
    PUSH16 = 0x6f,
    // place 17 byte item on stack
    PUSH17 = 0x70,
    // place 18 byte item on stack
    PUSH18 = 0x71,
    // place 19 byte item on stack
    PUSH19 = 0x72,
    // place 20 byte item on stack
    PUSH20 = 0x73,
    // place 21 byte item on stack
    PUSH21 = 0x74,
    // place 22 byte item on stack
    PUSH22 = 0x75,
    // place 23 byte item on stack
    PUSH23 = 0x76,
    // place 24 byte item on stack
    PUSH24 = 0x77,
    // place 25 byte item on stack
    PUSH25 = 0x78,
    // place 26 byte item on stack
    PUSH26 = 0x79,
    // place 27 byte item on stack
    PUSH27 = 0x7a,
    // place 28 byte item on stack
    PUSH28 = 0x7b,
    // place 29 byte item on stack
    PUSH29 = 0x7c,
    // place 30 byte item on stack
    PUSH30 = 0x7d,
    // place 31 byte item on stack
    PUSH31 = 0x7e,
    // place 32 byte item on stack
    PUSH32 = 0x7f,

    // copies the highest item in the stack to the top of the stack
    DUP1 = 0x80,
    // copies the second highest item in the stack to the top of the stack
    DUP2 = 0x81,
    // copies the third highest item in the stack to the top of the stack
    DUP3 = 0x82,
    // copies the 4th highest item in the stack to the top of the stack
    DUP4 = 0x83,
    // copies the 5th highest item in the stack to the top of the stack
    DUP5 = 0x84,
    // copies the 6th highest item in the stack to the top of the stack
    DUP6 = 0x85,
    // copies the 7th highest item in the stack to the top of the stack
    DUP7 = 0x86,
    // copies the 8th highest item in the stack to the top of the stack
    DUP8 = 0x87,
    // copies the 9th highest item in the stack to the top of the stack
    DUP9 = 0x88,
    // copies the 10th highest item in the stack to the top of the stack
    DUP10 = 0x89,
    // copies the 11th highest item in the stack to the top of the stack
    DUP11 = 0x8a,
    // copies the 12th highest item in the stack to the top of the stack
    DUP12 = 0x8b,
    // copies the 13th highest item in the stack to the top of the stack
    DUP13 = 0x8c,
    // copies the 14th highest item in the stack to the top of the stack
    DUP14 = 0x8d,
    // copies the 15th highest item in the stack to the top of the stack
    DUP15 = 0x8e,
    // copies the 16th highest item in the stack to the top of the stack
    DUP16 = 0x8f,

    // swaps the highest and second highest value on the stack
    SWAP1 = 0x90,
    // swaps the highest and third highest value on the stack
    SWAP2 = 0x91,
    // swaps the highest and 4th highest value on the stack
    SWAP3 = 0x92,
    // swaps the highest and 5th highest value on the stack
    SWAP4 = 0x93,
    // swaps the highest and 6th highest value on the stack
    SWAP5 = 0x94,
    // swaps the highest and 7th highest value on the stack
    SWAP6 = 0x95,
    // swaps the highest and 8th highest value on the stack
    SWAP7 = 0x96,
    // swaps the highest and 9th highest value on the stack
    SWAP8 = 0x97,
    // swaps the highest and 10th highest value on the stack
    SWAP9 = 0x98,
    // swaps the highest and 11th highest value on the stack
    SWAP10 = 0x99,
    // swaps the highest and 12th highest value on the stack
    SWAP11 = 0x9a,
    // swaps the highest and 13th highest value on the stack
    SWAP12 = 0x9b,
    // swaps the highest and 14th highest value on the stack
    SWAP13 = 0x9c,
    // swaps the highest and 15th highest value on the stack
    SWAP14 = 0x9d,
    // swaps the highest and 16th highest value on the stack
    SWAP15 = 0x9e,
    // swaps the highest and 17th highest value on the stack
    SWAP16 = 0x9f,

    // Makes a log entry, no topics.
    LOG0 = 0xa0,
    // Makes a log entry, 1 topic.
    LOG1 = 0xa1,
    // Makes a log entry, 2 topics.
    LOG2 = 0xa2,
    // Makes a log entry, 3 topics.
    LOG3 = 0xa3,
    // Makes a log entry, 4 topics.
    LOG4 = 0xa4,

    // create a new account with associated code
    CREATE = 0xf0,
    // message-call into an account
    CALL = 0xf1,
    // message-call with another account's code only
    CALLCODE = 0xf2,
    // halt execution returning output data
    RETURN = 0xf3,
    // like CALLCODE but keeps caller's value and sender
    DELEGATECALL = 0xf4,
    // create a new account and set creation address to sha3(sender + sha3(init code)) % 2**160
    CREATE2 = 0xf5,
    // stop execution and revert state changes. Return output data.
    REVERT = 0xfd,
    // like CALL but it does not take value, nor modify the state
    STATICCALL = 0xfa,
    // halt execution and register account for later deletion
    SUICIDE = 0xff,
}

export const stringToOpCode = (name: string): OpCode => OpCode[name];

export const opCodeToString = (opCode: OpCode): string => OpCode[opCode.toString()];

export const opCodeToHex = (opCode: OpCode): string => `0x${Number(opCode).toString(16).padStart(2, '0')}`;

export const isPush = (opCode: OpCode): boolean => {
    return opCode >= OpCode.PUSH1 && opCode <= OpCode.PUSH32;
};
