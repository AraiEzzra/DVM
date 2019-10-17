import { PARAMS } from 'src/constants';
import { U256 } from 'src/interpreter/U256';
import { ERROR, VmError } from 'src/interpreter/exceptions';

export class Stack {

    private readonly data: Array<bigint>;

    constructor() {
        this.data = [];
    }

    get length(): number {
        return this.data.length;
    }

    push(value: bigint) {
        if (value > U256.MAX_VALUE) {
            throw new VmError(ERROR.OUT_OF_RANGE);
        }
        if (this.data.length === PARAMS.StackLimit) {
            throw new VmError(ERROR.STACK_OVERFLOW);
        }
        this.data.push(value);
    }

    pop(): bigint {
        if (this.data.length === 0) {
            throw new VmError(ERROR.STACK_UNDERFLOW);
        }
        return this.data.pop();
    }

    /**
     * Pop multiple items from stack. Top of stack is first item
     * in returned array.
     * @param n - Number of items to pop
     */
    popN(n: number = 1): Array<bigint> {
        if (this.data.length < n) {
            throw new VmError(ERROR.STACK_UNDERFLOW);
        }
        if (n === 0) {
            return [];
        }
        return this.data.splice(-1 * n).reverse();
    }

    peekN(n: number = 1): Array<bigint> {
        if (this.data.length < n) {
            throw new VmError(ERROR.STACK_UNDERFLOW);
        }
        if (n === 0) {
            return [];
        }
        return this.data.slice(-1 * n).reverse();
    }

    /**
     * Swap top of stack with an item in the stack.
     * @param position - Index of item from top of the stack (0-indexed)
     */
    swap(position: number) {
        if (this.data.length <= position) {
            throw new VmError(ERROR.STACK_UNDERFLOW);
        }

        const head = this.data.length - 1;
        const index = this.data.length - position - 1;

        const tmp = this.data[head];
        this.data[head] = this.data[index];
        this.data[index] = tmp;
    }

    /**
     * Pushes a copy of an item in the stack.
     * @param position - Index of item to be copied (1-indexed)
     */
    dup(position: number) {
        if (this.data.length < position) {
            throw new VmError(ERROR.STACK_UNDERFLOW);
        }

        const index = this.data.length - position;
        this.push(this.data[index]);
    }

    toString(): string {
        return this.data.map((value, index) => {
            const indexS = index.toString().padStart(4, '0');
            const valueS = value.toString(16).padStart(64, '0');

            return `${indexS}: ${valueS}`;
        }).join('\n');
    }
}
