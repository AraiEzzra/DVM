import { expect } from 'chai';
import { isBigIntEqual, hexToBuffer, loadTestCases } from 'test/helpers';
import { VMTestsJSON } from 'test/vm/VmJSON';
import { VM } from 'src/VM';
import { TestContext } from 'test/vm/TestContext';
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
        const cases = loadTestCases<VMTestsJSON>(testCasesName);

        cases.forEach(item => {
            for (let [name, caseData] of Object.entries(item)) {

                it(name, async () => {

                    const storage = new TestStorage(caseData.pre);
                    const context = new TestContext(caseData.env, caseData.exec);
                    const vm = new VM(context, storage);

                    if (caseData.post) {
                        const result = await vm.runCode(context.code);

                        expect(storage.data).to.deep.equal(new TestStorage(caseData.post).data);
                        expect(result.out).to.deep.equal(hexToBuffer(caseData.out));

                        isBigIntEqual(context.gas - result.gasUsed, BigInt(caseData.gas));

                    } else {
                        await expect(vm.runCode(context.code)).to.be.rejectedWith(Error);
                    }

                });
            }
        });
    });
});
