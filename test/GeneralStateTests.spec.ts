import { expect } from 'chai';
import { isBufferEqual } from 'test/helpers';
import { hexToBuffer, loadTestCases, makeTx } from 'test/helpers';
import { toBigIntBE } from 'bigint-buffer';
import { GeneralStateTestsJSON } from 'test/vm/VmJSON';
import { VM } from 'src/VM';
import { TestStorage } from 'test/vm/TestStorage';
import { TestContext } from 'test/vm/TestContext';

const TEST_CASES = [
    'GeneralStateTests/stArgsZeroOneBalance',
];

const FORC = 'ConstantinopleFix';

TEST_CASES.forEach(testCasesName => {
    describe(testCasesName, () => {
        const cases = loadTestCases<GeneralStateTestsJSON>(testCasesName);

        cases.forEach(item => {
            for (let [name, caseData] of Object.entries(item)) {

                for (let { indexes, hash } of caseData.post[FORC]) {

                    it(name, async () => {
                        const transaction = makeTx({
                            data: caseData.transaction.data[indexes.data],
                            gasLimit: caseData.transaction.gasLimit[indexes.gas],
                            gasPrice: caseData.transaction.gasPrice,
                            nonce: caseData.transaction.nonce,
                            secretKey: caseData.transaction.secretKey,
                            to: caseData.transaction.to,
                            value: caseData.transaction.value[indexes.value]
                        });

                        const basefee = 21000n;

                        const senderAddress = transaction.getSenderAddress();
                        const gasLimit = toBigIntBE(transaction.gasLimit);
                        const gasPrice = toBigIntBE(transaction.gasPrice);

                        const storage = new TestStorage(caseData.pre);
                        const context = new TestContext(caseData.env);

                        context.caller = senderAddress;
                        context.address = transaction.to;
                        context.gas = gasLimit;
                        context.gasPrice = gasPrice;
                        context.code = storage.getCode(transaction.to);
                        context.value = transaction.value;
                        context.data = transaction.data;

                        // TODO
                        storage.addBalance(transaction.to, toBigIntBE(transaction.value));
                        storage.subBalance(senderAddress, toBigIntBE(transaction.value));

                        storage.setNonce(senderAddress, storage.getNonce(senderAddress) + 1n);
                        storage.subBalance(senderAddress, gasLimit * gasPrice);

                        const vm = new VM(context, storage);

                        const result = await vm.runCode(context.code);

                        const gasUsed = result.gasUsed + basefee;

                        storage.addBalance(senderAddress, (gasLimit - gasUsed) * gasPrice);

                        storage.addBalance(context.currentCoinbase, gasUsed * gasPrice);

                        const tree = await storage.toMerklePatriciaTree();

                        isBufferEqual(tree.root, hexToBuffer(hash));
                    });
                }
            }
        });
    });
});
