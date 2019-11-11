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

export type TestJSON = {
    env: EnvJSON;
    exec: ExecJSON;
    out: string;
    gas: string;
    logs: string;
    post: {
        [address: string]: AccountJSON;
    };
    pre: {
        [address: string]: AccountJSON;
    };
};

export type TestFile = {
    [name: string]: TestJSON;
};
