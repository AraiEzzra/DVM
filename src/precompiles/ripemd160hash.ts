import { VM } from 'src/VM';
import { IPrecompiledContract, Contract } from 'src/Contract';
import crypto from 'crypto';
import { bufferPadStart } from 'src/interpreter/utils';
import { U256 } from 'src/interpreter/U256';

export const ripemd160hash: IPrecompiledContract = (vm: VM, contract: Contract, input: Buffer): Buffer => {

    const gas = vm.config.params.Ripemd160BaseGas
        + vm.config.params.Ripemd160PerWordGas * U256.divCeil(BigInt(input.length));

    contract.useGas(gas);

    const hash = crypto.createHash('ripemd160').update(input).digest();

    return bufferPadStart(hash, 32);
};
