export type Message = {
    from: Buffer;
    to: Buffer;
    gasPrice: bigint;
    gas: bigint;
    value: bigint;
    nonce: bigint;
    data: Buffer;
    checkNonce: boolean;
};
