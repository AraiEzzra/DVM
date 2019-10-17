import { expect } from 'chai';
import { isBufferEqual, hexToBigInt } from 'test/helpers';
import { hexToBuffer, loadTestCases } from 'test/helpers';
import { toBigIntBE } from 'bigint-buffer';
import { TestsJSON, TransactionJSON, PostStateJSON } from 'test/GeneralStateTests/TestsJSON';
import { VM } from 'src/VM';
import { TestStorage } from 'test/vm/TestStorage';
import { TestContext } from 'test/GeneralStateTests/TestContext';
import { Transaction } from 'ethereumjs-tx';
import { Message } from 'src/Message';
import { GasPool } from 'src/GasPool';

const TEST_CASES = [
    'GeneralStateTests/stArgsZeroOneBalance',
];

const FORC = 'ConstantinopleFix';

TEST_CASES.forEach(testCasesName => {
    describe(testCasesName, () => {
        const cases = loadTestCases<TestsJSON>(testCasesName);

        cases.forEach(item => {
            for (let [testName, test] of Object.entries(item)) {

                if (testName !== 'callNonConst') {
                    continue;
                }

                for (let post of test.post[FORC].slice(1, 2)) {
                    it(testName, async () => {

                        const storage = new TestStorage(test.pre);
                        const message = makeMessage(test.transaction, post);
                        const context = new TestContext(message, test);
                        const vm = new VM(context, storage);
                        const gasPool = new GasPool(context.gasLimit);

                        const result = await vm.applyMessage(message, gasPool);

                        console.log(result)
                        console.log(storage.data)

                        const tree = await storage.toMerklePatriciaTree();
                        const hash = hexToBuffer(post.hash);

                        expect(
                            tree.root.equals(hash),
                            `post state root mismatch: got ${tree.root.toString('hex')}, want ${hash.toString('hex')}`
                        ).to.equal(true);

                    });
                }
            }
        });
    });
});

export const makeMessage = (txJSON: TransactionJSON, post: PostStateJSON): Message => {

    if (post.indexes.data > txJSON.data.length) {
        throw new Error(`tx data index ${post.indexes.data} out of bounds`);
    }

    if (post.indexes.value > txJSON.value.length) {
        throw new Error(`tx value index ${post.indexes.value} out of bounds`);
    }

    if (post.indexes.gas > txJSON.gasLimit.length) {
        throw new Error(`tx gas index ${post.indexes.gas} out of bounds`);
    }

    const data = hexToBuffer(txJSON.data[post.indexes.data]);
    const value = hexToBigInt(txJSON.value[post.indexes.value]);
    const gas = hexToBigInt(txJSON.gasLimit[post.indexes.gas]);
    
    // TODO replace to crypto.ToECDSA
    const transaction = new Transaction();
    transaction.sign(hexToBuffer(txJSON.secretKey));
   
    return {
        from: transaction.getSenderAddress(),
        to: hexToBuffer(txJSON.to),
        gasPrice: hexToBigInt(txJSON.gasPrice),
        gas,
        value,
        nonce: hexToBigInt(txJSON.nonce),
        data
    };
};
