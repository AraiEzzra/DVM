import { ERROR, VmError } from 'src/exceptions';
import { bufferPadEnd } from 'src/interpreter/utils';

export class Memory {

    private store: Buffer;

    constructor() {
        this.store = Buffer.alloc(0);
    }

    get length(): number {
        return this.store.length;
    }

    set(offset: number, size: number, value: Buffer) {
        if (size > 0) {
            if (offset + size > this.store.length) {
                throw new VmError(ERROR.INVALID_MEMORY);
            }
            if (value.length !== size) {
                throw new VmError(ERROR.INVALID_MEMORY);
            }
            for (let i = 0; i < size; i++) {
                this.store[offset + i] = value[i];
            }
        }
    }

    get(offset: number, size: number): Buffer {
        if (size === 0) {
            return Buffer.alloc(0);
        }
        const buffer = this.store.slice(offset, offset + size);
        return bufferPadEnd(buffer, size);
    }

    resize(size: number) {
        if (this.store.length < size) {
            this.store = bufferPadEnd(this.store, size);
        }
    }
}
