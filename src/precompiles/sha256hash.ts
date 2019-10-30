import { VM } from 'src/VM';
import { IPrecompiledContract, Contract } from 'src/Contract';
import crypto from 'crypto';
import { U256 } from 'src/interpreter/U256';

export const sha256hash: IPrecompiledContract = (vm: VM, contract: Contract, input: Buffer): Buffer => {

    const gas = vm.config.params.Sha256BaseGas
        + vm.config.params.Sha256PerWordGas * U256.divCeil(BigInt(input.length));

    contract.useGas(gas);

    return crypto.createHash('sha256').update(input).digest();
};
