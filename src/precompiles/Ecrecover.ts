import { PARAMS } from 'src/Config';
import { IPrecompiledContract } from 'src/Contract';
import { bufferPadEnd } from 'src/interpreter/utils';

// TODO remove this shit
import BN from 'bn.js';
import { setLengthLeft, setLengthRight, ecrecover, publicToAddress } from 'ethereumjs-util';

export class Ecrecover implements IPrecompiledContract {

    requiredGas(input: Buffer): bigint {
        // TODO move to vm.config.params
        return PARAMS.EcrecoverGas;
    }
    
    run(input: Buffer): Buffer {
        const ecRecoverInputLength = 128;
        input = bufferPadEnd(input, ecRecoverInputLength);

        const msgHash = input.slice(0, 32);
        const v = input.slice(32, 64);
        const r = input.slice(64, 96);
        const s = input.slice(96, 128);

        try {
            const publicKey = ecrecover(msgHash, new BN(v).toNumber(), r, s);
            return setLengthLeft(publicToAddress(publicKey), 32);
        } catch (e) {
            return Buffer.alloc(0);
        }
    }
}
