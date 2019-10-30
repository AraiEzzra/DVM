export class Stack {

    private readonly data: Array<bigint>;

    constructor() {
        this.data = [];
    }

    get length(): number {
        return this.data.length;
    }

    push(value: bigint) {
        this.data.push(value);
    }

    pop(): bigint {
        return this.data.pop();
    }

    back(n: number): bigint {
        return this.data[this.data.length - n - 1];
    }

    swap(position: number) {
        const head = this.data.length - 1;
        const index = this.data.length - position - 1;

        const tmp = this.data[head];
        this.data[head] = this.data[index];
        this.data[index] = tmp;
    }

    dup(position: number) {
        const index = this.data.length - position;
        this.push(this.data[index]);
    }

    toString(): string {
        return this.data.join();
    }
}
