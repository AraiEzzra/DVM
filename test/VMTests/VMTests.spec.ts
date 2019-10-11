import { expect } from 'chai';
import { hexToBuffer, loadTestCases, hexToBigInt } from 'test/helpers';
import { TestsJSON, TestJSON } from 'test/VMTests/TestsJSON';
import { VmError } from 'src/interpreter/exceptions';
import { VM, VMResult } from 'src/VM';
import { TestContext } from 'test/VMTests/TestContext';
import { TestStorage } from 'test/vm/TestStorage';

const TEST_CASES = [
    // 'VMTests/vmArithmeticTest',
    // 'VMTests/vmBitwiseLogicOperation',
    // 'VMTests/vmBlockInfoTest',
    // 'VMTests/vmEnvironmentalInfo',
    // 'VMTests/vmIOandFlowOperations',
    'VMTests/vmLogTest',
    // 'VMTests/vmPerformance',
    // 'VMTests/vmPushDupSwapTest',
    // 'VMTests/vmSha3Test',
    // 'VMTests/vmSystemOperations',
];

TEST_CASES.forEach(testCasesName => {
    describe(testCasesName, () => {
        const cases = loadTestCases<TestsJSON>(testCasesName);

        cases.forEach(item => {
            for (let [testName, testJSON] of Object.entries(item)) {

                if (testName !== 'log0_emptyMem') {
                    continue;
                }

                it(testName, async () => {
                    const context = new TestContext(testJSON);
                    const storage = new TestStorage(testJSON.pre);
                    const vm = new VM(context, storage);

                    try {
                        const { returnData, leftOverGas } = await execute(vm, testJSON);

                        if (testJSON.gas === undefined) {
                            throw new Error('gas unspecified (indicating an error), but VM returned no error');
                        }

                        const expectReturnData = hexToBuffer(testJSON.out);
                        const expectGas = hexToBigInt(testJSON.gas);
    
                        expect(expectReturnData, `return data mismatch: got ${returnData}, want ${expectReturnData}`)
                            .to.deep.equal(returnData);
    
                        expect(expectGas === leftOverGas, `remaining gas ${leftOverGas}, want ${expectGas}`).to.true;
    
                        expect(storage.data, 'wrong storage value').to.deep.equal(new TestStorage(testJSON.post).data);

                    } catch (error) {
                        if (!(error instanceof VmError)) {
                            throw error;
                        }                                      
                    }
                });
            }
        });
    });
});


const execute = async (vm: VM, testJSON: TestJSON): Promise<VMResult> => {
    const caller = vm.accountRef(hexToBuffer(testJSON.exec.caller));
    const address = hexToBuffer(testJSON.exec.address);
    const data = hexToBuffer(testJSON.exec.data);
    const gasLimit = hexToBigInt(testJSON.exec.gas);
    const value = hexToBigInt(testJSON.exec.value);

    return await vm.call(caller, address, data, gasLimit, value);
}