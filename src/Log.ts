export type Log = {
    address: Buffer;
    topics: Array<Buffer>;
    data: Buffer;
    blockNumber: number;
    txHash?: Buffer;
    txIndex?: number;
    blockHash?: Buffer;
    index?: number;
    removed?: boolean;
}
