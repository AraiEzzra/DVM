import { expect } from 'chai';
import { isBigIntEqual } from 'test/helpers';
import { hexToBuffer, loadTestCases } from 'test/vm';
import { VM } from 'src/VM';
import { TestContext } from 'test/vm/TestContext';
import { TestStorage } from 'test/vm/TestStorage';

const TEST_CASES = [
    'vmArithmeticTest',
    'vmBitwiseLogicOperation',
    'vmBlockInfoTest',
    'vmEnvironmentalInfo',
    'vmIOandFlowOperations',
    'vmLogTest',
    // 'vmPerformance',
    'vmPushDupSwapTest',
    'vmSha3Test',
    'vmSystemOperations',
];

TEST_CASES.forEach(testCasesName => {
    describe(testCasesName, () => {
        const cases = loadTestCases(testCasesName);

        cases.forEach(item => {
            for (let [name, caseData] of Object.entries(item)) {

                it(name, async () => {
    
                    // TODO
                    const pre = Object.values(caseData.pre)[0];
    
                    const storage = new TestStorage(pre.storage);
                    const context = new TestContext(caseData.env, caseData.exec);
                    const vm = new VM(context, storage);
    
                    if (caseData.post) {
                        const result = await vm.runCode(context.code);
    
                        const post = Object.values(caseData.post)[0];
    
                        expect(storage).to.deep.equal(new TestStorage(post.storage));
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
