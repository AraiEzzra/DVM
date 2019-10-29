export type AccountJSON = {
    code: string;
    nonce: string;
    balance: string;
    storage: {
        [key: string]: string;
    }
};

export type EnvJSON = {
    currentCoinbase: string;
    currentDifficulty: string;
    currentGasLimit: string;
    currentNumber: string;
    currentTimestamp: string;
};

export type TransactionJSON = {
    data: Array<string>;
    gasLimit: Array<string>;
    gasPrice: string;
    nonce: string;
    secretKey: string;
    to: string;
    value: Array<string>;
};

export type PostStateJSON = {
    hash: string;
    indexes : {
        data: number;
        gas: number;
        value: number;
    },
    logs: string;
};

export type TestJSON = {
    env: EnvJSON;
    post: {
        [fork: string]: Array<PostStateJSON>
    };
    pre: {
        [address: string]: AccountJSON;
    };
    transaction: TransactionJSON;
}

export type TestsJSON = {
    [name: string]: TestJSON;
};
