export class Stack {

    private readonly stackLimit: number;

    private readonly data: Array<bigint>;

    constructor(stackLimit: number) {
        this.stackLimit = stackLimit;
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
        return this.data.map((value, index) => {
            const indexS = index.toString().padStart(4, '0');
            const valueS = value.toString(16).padStart(64, '0');

            return `${indexS}: ${valueS}`;
        }).join('\n');
    }
}
