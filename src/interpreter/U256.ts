export class U256 {

    static readonly MAX_VALUE: bigint = 2n ** 256n - 1n;

    static readonly BYTE: bigint = BigInt(0xff);

    static asUint(value: bigint): bigint {
        return BigInt.asUintN(256, value);
    }

    static asInt(value: bigint): bigint {
        return BigInt.asIntN(256, value);
    }

    static expmod(base: bigint, exp: bigint): bigint {
        if (exp === 0n) {
            return 1n;
        }
        if (base === 0n) {
            return 0n;
        }
        if (exp === 1n) {
            return base;
        }
        if (exp % 2n === 0n) {
            return BigInt.asUintN(256, U256.expmod( base, (exp / 2n)) ** 2n);
        }
        return BigInt.asUintN(256, base * U256.expmod( base, (exp - 1n)));
    }

    static bit(value: bigint, bit: bigint): bigint {
        const lBit = 1n << bit;
        return (lBit & value) === lBit
            ? 1n
            : 0n;
    }

    static bitCount(value: bigint): number {
        // TODO
        return value === 0n
            ? 0
            : value.toString(2).length;
    }

    static byteCount(value: bigint): number {
        return Math.ceil(U256.bitCount(value) / 8);
    }

    // TODO
    static divCeil = (value: bigint): bigint => {
        const div = value / 32n;
        const mod = value % 32n;
    
        // Fast case - exact division
        if (mod === 0n) {
            return div;
        }
    
        // Round up
        return div < 0n ? div - 1n : div + 1n;
    }
}
