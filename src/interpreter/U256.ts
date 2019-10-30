
export class U256 {

    static readonly BYTE: bigint = 0xffn;

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
        const z = U256.expmod(base, exp / 2n);
        if (exp % 2n === 0n) {
            return BigInt.asUintN(256, z * z);
        }
        return BigInt.asUintN(256, base * z * z);
    }

    static bit(value: bigint, bit: bigint): bigint {
        const lBit = 1n << bit;
        return (lBit & value) === lBit
            ? 1n
            : 0n;
    }

    static divCeil = (value: bigint): bigint => {
        const div = value / 32n;
        const mod = value % 32n;
    
        if (mod === 0n) {
            return div;
        }
        return div < 0n ? div - 1n : div + 1n;
    }
}
