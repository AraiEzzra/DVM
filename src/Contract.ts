import { VmError, ERROR } from 'src/interpreter/exceptions';

export type ContractRef = {
    address: Buffer;
}

export class Contract {

    callerAddress: Buffer;
    caller: ContractRef;
    self: ContractRef;

    code: Buffer;
    codeAddress: Buffer;
    input: Buffer;
    
    gas: bigint;
    value: bigint;

    constructor(caller: ContractRef, self: ContractRef, value: bigint, gas: bigint) {
        this.callerAddress = caller.address;
        this.caller = caller;
        this.self = self;
        
        this.value = value;
        this.gas = gas;
    }

    useGas(amount: bigint) {
        if (amount > this.gas) {
            throw new VmError(ERROR.OUT_OF_GAS);
        }        
        this.gas -= amount;
    }

    setCallCode(address: Buffer, code: Buffer) {
        this.codeAddress = address;
        this.code = code;
    }

    get address(): Buffer {
        return this.self.address;
    }
}
