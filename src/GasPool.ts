import { TransitionError, ERROR } from 'src/exceptions';

export class GasPool {

    private value: bigint;

    constructor(value: bigint = 0n) {
        this.value = value;
    }

    addGas(amount: bigint) {
        this.value += amount;
    }

    subGas(amount: bigint) {
        if (amount > this.value) {
            throw new TransitionError(ERROR.GAS_LIMIT_REACHED);
        }
        this.value -= amount;
    }

    get gas(): bigint {
        return this.value;        
    }

}
