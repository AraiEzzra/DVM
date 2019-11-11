import { VM } from 'src/VM';
import { IPrecompiledContract, Contract } from 'src/Contract';
import { ERROR, VmError } from 'src/exceptions';

export const notSupported = (address: bigint): IPrecompiledContract => {
    return (vm: VM, contract: Contract, input: Buffer): Buffer => {
        const message = ERROR.NOT_SUPPORTED_PRECOMPILED(vm.config.bigIntToAddress(address));
        throw new VmError(message);    
    };
};
