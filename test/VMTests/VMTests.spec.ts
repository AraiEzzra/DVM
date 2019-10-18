import { expect } from 'chai';
import { hexToBuffer, loadTestCases, hexToBigInt, logsToHash } from 'test/helpers';
import { TestsJSON, TestJSON } from 'test/VMTests/TestsJSON';
import { VmError } from 'src/interpreter/exceptions';
import { VM, VMCallResult } from 'src/VM';
import { TestContext } from 'test/VMTests/TestContext';
import { TestStorage } from 'test/vm/TestStorage';

const TEST_CASES = [
    'VMTests/vmArithmeticTest',
    'VMTests/vmBitwiseLogicOperation',
    'VMTests/vmBlockInfoTest',
    'VMTests/vmEnvironmentalInfo',
    'VMTests/vmIOandFlowOperations',
    'VMTests/vmLogTest',
    // 'VMTests/vmPerformance',
    'VMTests/vmPushDupSwapTest',
    'VMTests/vmSha3Test',
    'VMTests/vmSystemOperations',
];

TEST_CASES.forEach(testCasesName => {
    describe(testCasesName, () => {
        const cases = loadTestCases<TestsJSON>(testCasesName);

        cases.forEach(item => {
            for (let [testName, testJSON] of Object.entries(item)) {

                it(testName, async () => {
                    const context = new TestContext(testJSON);
                    const storage = new TestStorage(testJSON.pre);
                    const vm = new VM(context, storage);

                    const { returnData, leftOverGas, error } = await execute(vm, testJSON);
                    const logs = logsToHash(storage.logs());

                    if (testJSON.gas === undefined) {
                        if (error === undefined) {
                            throw new Error('gas unspecified (indicating an error), but VM returned no error');
                        }
                        if (leftOverGas > 0) {
                            throw new Error('gas unspecified (indicating an error), but VM returned gas remaining > 0');
                        }
                        return;
                    }

                    const expectReturnData = hexToBuffer(testJSON.out);
                    const expectGas = hexToBigInt(testJSON.gas);
                    const expectLogs = hexToBuffer(testJSON.logs);

                    expect(
                        expectReturnData.equals(returnData),
                        `return data mismatch: got ${returnData}, want ${expectReturnData}`
                    ).to.equal(true);

                    expect(
                        expectGas === leftOverGas,
                        `remaining gas ${leftOverGas}, want ${expectGas}`
                    ).to.equal(true);

                    expect(
                        storage.data,
                        `wrong storage value`
                    ).to.deep.equal(new TestStorage(testJSON.post).data);

                    expect(
                        expectLogs.equals(logs),
                        `post state logs hash mismatch: got ${logs}, want ${expectLogs}`
                    ).to.equal(true);
                });
            }
        });
    });
});

const execute = async (vm: VM, testJSON: TestJSON): Promise<VMCallResult> => {
    const caller = vm.accountRef(hexToBuffer(testJSON.exec.caller));
    const address = hexToBuffer(testJSON.exec.address);
    const data = hexToBuffer(testJSON.exec.data);
    const gasLimit = hexToBigInt(testJSON.exec.gas);
    const value = hexToBigInt(testJSON.exec.value);

    return await vm.call(caller, address, data, gasLimit, value);
};
