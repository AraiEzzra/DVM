export class U256 {

    static readonly MAX_VALUE: bigint = 2n ** 256n - 1n;

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
}
