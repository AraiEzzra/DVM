import { toBigIntBE } from 'bigint-buffer';
import { IPrecompiledContract } from 'src/Contract';
import { Ecrecover } from 'src/precompiles/Ecrecover';

const ecrecover = new Ecrecover();

export const getPrecompiledContract = (codeAddress: Buffer): IPrecompiledContract => {
    const n = toBigIntBE(codeAddress);

    switch (n) {
        case 1n:
            return ecrecover;

        default:
            return null;
    }
};
