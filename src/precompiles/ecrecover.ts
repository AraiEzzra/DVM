import { PARAMS } from 'src/Config';
import { IPrecompiledContract, Contract } from 'src/Contract';
import { bufferPadEnd } from 'src/interpreter/utils';

// TODO remove this shit
import BN from 'bn.js';
import { setLengthLeft, setLengthRight, ecrecover as ethereumEcrecover, publicToAddress } from 'ethereumjs-util';
import { VM } from 'src/VM';

export const ecrecover: IPrecompiledContract = (vm: VM, contract: Contract, input: Buffer): Buffer => {

    contract.useGas(vm.config.params.EcrecoverGas);

    const ecRecoverInputLength = 128;
    input = bufferPadEnd(input, ecRecoverInputLength);

    const msgHash = input.slice(0, 32);
    const v = input.slice(32, 64);
    const r = input.slice(64, 96);
    const s = input.slice(96, 128);

    try {
        const publicKey = ethereumEcrecover(msgHash, new BN(v).toNumber(), r, s);
        return setLengthLeft(publicToAddress(publicKey), 32);
    } catch (error) {
        return Buffer.alloc(0);
    }
};
