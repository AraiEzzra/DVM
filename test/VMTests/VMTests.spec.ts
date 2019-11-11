import { expect } from 'chai';
import { hexToBuffer, hexToBigInt, logsToHash } from 'test/utils';
import { TestJSON } from 'test/VMTests/TestsJSON';
import { VM, VMCallResult } from 'src/VM';
import { TestContext } from 'test/VMTests/TestContext';
import { TestStorage } from 'test/utils/TestStorage';
import { testConfig } from 'test/VMTests/TestConfig';
import { testMatcher } from 'test/VMTests/testMatcher';

describe('VMTests', () => {
    for (const { path, test } of testMatcher) {
        it(path, async () => {

            const context = new TestContext(test);
            const storage = new TestStorage(test.pre);
            const vm = new VM(context, storage, testConfig);

            const { returnData, leftOverGas, error } = await execute(vm, test);
            const logs = logsToHash(storage.logs());

            if (test.gas === undefined) {
                if (error === undefined) {
                    throw new Error('gas unspecified (indicating an error), but VM returned no error');
                }
                if (leftOverGas > 0) {
                    throw new Error('gas unspecified (indicating an error), but VM returned gas remaining > 0');
                }
                return;
            }

            const expectReturnData = hexToBuffer(test.out);
            const expectGas = hexToBigInt(test.gas);
            const expectLogs = hexToBuffer(test.logs);

            expect(
                expectReturnData.equals(returnData),
                `return data mismatch: got ${returnData.toString('hex')}, want ${expectReturnData.toString('hex')}`
            ).to.equal(true);

            expect(
                expectGas === leftOverGas,
                `remaining gas ${leftOverGas}, want ${expectGas}`
            ).to.equal(true);

            expect(
                storage.getData(),
                `wrong storage value`
            ).to.deep.equal(new TestStorage(test.post).getData());

            expect(
                expectLogs.equals(logs),
                `post state logs hash mismatch: got ${logs.toString('hex')}, want ${expectLogs.toString('hex')}`
            ).to.equal(true);
        });
    }
});

const execute = async (vm: VM, test: TestJSON): Promise<VMCallResult> => {
    const caller = vm.accountRef(hexToBuffer(test.exec.caller));
    const address = hexToBuffer(test.exec.address);
    const data = hexToBuffer(test.exec.data);
    const gasLimit = hexToBigInt(test.exec.gas);
    const value = hexToBigInt(test.exec.value);

    return await vm.call(caller, address, data, gasLimit, value);
};
