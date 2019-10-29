import { StackRange } from 'src/interpreter/Instruction';
import { PARAMS } from 'src/Config';

export const stackRange = (pop: number, push: number): StackRange => ({
    min: pop,
    max: PARAMS.StackLimit + pop - push
});

export const swapStackRange = (n: number): StackRange => stackRange(n + 1, n + 1);

export const dupStackRange = (n: number): StackRange => stackRange(n, n + 1);
