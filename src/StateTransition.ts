import { VM, VMResult } from 'src/VM';
import { Message } from 'src/Message';
import { GasPool } from 'src/GasPool';
import { VmError, ERROR } from 'src/interpreter/exceptions';
import { PARAMS } from 'src/constants';

export class StateTransition {

    private vm: VM;

    private message: Message;

    private gasPool: GasPool;

    private gas: bigint;

    private initialGas: bigint;

    constructor(vm: VM, message: Message, gasPool: GasPool) {
        this.vm = vm;
        this.message = message;
        this.gasPool = gasPool;

        this.gas = 0n;
        this.initialGas = 0n;
    }

    buyGas() {
        const value = this.message.gas * this.message.gasPrice;

        if (this.vm.storage.getBalance(this.message.from) < value) {
            throw new VmError(ERROR.INSUFFICIENT_BALANCE_FOR_GAS);
        }

        this.gasPool.subGas(this.message.gas);

        this.gas = this.message.gas;
        this.initialGas = this.message.gas;

        this.vm.storage.subBalance(this.message.from, value);
    }

    intrinsicGas(data: Buffer): bigint {
        let gas = PARAMS.TxGas;
        for (let i = 0; i < data.length; i++) {
            gas += data[i] === 0
                ? PARAMS.TxDataZeroGas
                : PARAMS.TxDataNonZeroGasFrontier;
        }
        return gas;
    }

    useGas(amount: bigint) {
        if (this.gas < amount) {
            throw new VmError(ERROR.OUT_OF_GAS);
        }
        this.gas -= amount;
    }

    refundGas() {
        // TODO
        // const refund = this.gasUsed() / 2n;
        // this.gas += refund;

        const remaining = this.gas * this.message.gasPrice;
        this.vm.storage.addBalance(this.message.from, remaining);

        this.gasPool.addGas(this.gas);
    }

    gasUsed(): bigint {
        return this.initialGas - this.gas;
    }

    async run(): Promise<VMResult> {
        const { vm, message } = this;

        this.buyGas();

        const sender = vm.accountRef(message.from);
        const gas = this.intrinsicGas(message.data);

        this.useGas(gas);

        vm.storage.setNonce(sender.address, vm.storage.getNonce(sender.address) + 1n);

        const result = await this.vm.call(sender, message.to, message.data, this.gas, message.value);
        this.gas = result.leftOverGas;

        this.refundGas();

        vm.storage.addBalance(vm.context.coinbase, this.gasUsed() * message.gasPrice);

        return {
            returnData: result.returnData,
            leftOverGas: this.gasUsed()
        };
    }
}
