import { VM } from 'src/VM';
import { IPrecompiledContract, Contract } from 'src/Contract';
import { U256 } from 'src/interpreter/U256';

export const identity: IPrecompiledContract = (vm: VM, contract: Contract, input: Buffer): Buffer => {

    const gas = vm.config.params.IdentityBaseGas
        + vm.config.params.IdentityPerWordGas * U256.divCeil(BigInt(input.length));

    contract.useGas(gas);

    return input;
};
