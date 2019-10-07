export type AccountJSON = {
    code: string;
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

export const EmptyEnvJSON = {
    currentCoinbase: '0x',
    currentDifficulty: '0x',
    currentGasLimit: '0x',
    currentNumber: '0x',
    currentTimestamp: '0x'
};

export type ExecJSON = {
    address: string;
    origin: string;
    code: string;
    data: string;
    value: string;
    gas: string;
    gasPrice: string;
    caller: string;
};

export const EmptyExecJSON: ExecJSON = {
    address: '0x',
    origin: '0x',
    code: '0x',
    data: '0x',
    value: '0x',
    gas: '0x',
    gasPrice: '0x',
    caller: '0x',
};

export type TestCaseJSON = {
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

export type VmJSON = {
    [name: string]: TestCaseJSON;
};
