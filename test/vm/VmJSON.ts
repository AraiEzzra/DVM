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

export type ExecJSON = {
    address?: string;
    origin?: string;
    code?: string;
    data?: string;
    value?: string;
    gas?: string;
    gasPrice?: string;
    caller?: string;
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

export type VMTestsJSON = {
    [name: string]: {
        env: EnvJSON;
        exec: ExecJSON;
        out: string;
        gas: string;
        post: {
            [address: string]: AccountJSON;
        };
        pre: {
            [address: string]: AccountJSON;
        };
    };
};

export type GeneralStateTestsJSON = {
    [name: string]: {
        env: EnvJSON;
        post: {
            [fork: string]: Array<{
                hash: string;
                indexes : {
                    data: number;
                    gas: number;
                    value: number;
                },
                logs: string;
            }>
        };
        pre: {
            [address: string]: AccountJSON;
        };
        transaction: TransactionJSON;
    }
};
