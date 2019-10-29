import { State } from 'src/interpreter/State';

export const useMemoryMstore = (state: State) => {
    const offset = state.stack.back(0);
    state.memory.resize(Number(offset) + 32);
};

export const useMemoryMstore8 = (state: State) => {
    const offset = state.stack.back(0);
    state.memory.resize(Number(offset) + 1);
};

export const useMemoryCodeCopy = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(2);
    state.memory.resize(Number(offset + length));
};

export const useMemoryCallDataCopy = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(2);
    state.memory.resize(Number(offset + length));
};

export const useMemoryCall = (state: State) => {
    const outOffset = state.stack.back(5);
    const outLength = state.stack.back(6);

    state.memory.resize(Number(outOffset + outLength));
};

export const useMemoryExtCodeCopy = (state: State) => {
    const offset = state.stack.back(1);
    const length = state.stack.back(2);

    state.memory.resize(Number(offset + length));
};

export const useMemoryDelegateCall = (state: State) => {
    const outOffset = state.stack.back(4);
    const outLength = state.stack.back(5);
    state.memory.resize(Number(outOffset + outLength));
};

export const useMemoryStaticCall = (state: State) => {
    const outOffset = state.stack.back(4);
    const outLength = state.stack.back(5);

    state.memory.resize(Number(outOffset + outLength));
};

export const useMemoryReturnDataCopy = (state: State) => {
    const offset = state.stack.back(0);
    const length = state.stack.back(2);

    state.memory.resize(Number(offset + length));
};
