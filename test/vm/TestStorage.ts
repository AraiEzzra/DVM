import { IStorage } from 'src/IStorage';
import { hexToBuffer } from 'test/vm';

export class TestStorage implements IStorage {

    private data: Map<string, Buffer>;

    constructor(data: {[key: string]: string} = {}) {
        this.data = new Map();

        Object.entries(data).forEach(([key, value]) => {
            this.data.set(hexToBuffer(key, 32).toString('hex'), hexToBuffer(value, 32));
        });
    }

    get size(): number {
        return this.data.size;
    }

    getValue(address: string, key: Buffer): Buffer {
        return this.data.get(key.toString('hex')) || Buffer.alloc(0);
    }

    setValue(address: string, key: Buffer, value: Buffer) {
        if (value.length === 0) {
            this.data.delete(key.toString('hex'));
        } else {
            this.data.set(key.toString('hex'), value);
        }
    }

    toString(): string {
        return [...this.data.entries()].map(([key, value]) => {
            const indexS = key.padStart(64, '0');
            const valueS = value.toString('hex').padStart(64, '0');

            return `${indexS}: ${valueS}`;
        }).join('\n');
    }
}
