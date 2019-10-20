import { VM, VMCallResult } from 'src/VM';
import { Message } from 'src/Message';
import { GasPool } from 'src/GasPool';
import { VmError, ERROR } from 'src/interpreter/exceptions';

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

    intrinsicGas(data: Buffer, contractCreation: boolean): bigint {
        let gas = contractCreation
            ? this.vm.config.params.TxGasContractCreation
            : this.vm.config.params.TxGas;

        for (let i = 0; i < data.length; i++) {
            gas += data[i] === 0
                ? this.vm.config.params.TxDataZeroGas
                : this.vm.config.params.TxDataNonZeroGas;
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
        let refund = this.gasUsed() / 2n;
        if (refund > this.vm.storage.getRefund()) {
            refund = this.vm.storage.getRefund();
        }
        this.gas += refund;

        const remaining = this.gas * this.message.gasPrice;
        this.vm.storage.addBalance(this.message.from, remaining);

        this.gasPool.addGas(this.gas);
    }

    gasUsed(): bigint {
        return this.initialGas - this.gas;
    }

    async run(): Promise<VMCallResult> {
        const { vm, message } = this;

        this.buyGas();

        const sender = vm.accountRef(message.from);
        // TODO add null to to
        const contractCreation = this.message.to.length === 0;
        const gas = this.intrinsicGas(message.data, contractCreation);

        this.useGas(gas);

        let result;
        if (contractCreation) {
            result = await this.vm.create(sender, message.data, this.gas, message.value);
        } else {
            vm.storage.setNonce(sender.address, vm.storage.getNonce(sender.address) + 1n);
            result = await this.vm.call(sender, message.to, message.data, this.gas, message.value);
        }

        this.gas = result.leftOverGas;

        this.refundGas();

        vm.storage.addBalance(vm.context.coinbase, this.gasUsed() * message.gasPrice);

        return {
            returnData: result.returnData,
            leftOverGas: this.gasUsed(),
            error: result.error
        };
    }
}
