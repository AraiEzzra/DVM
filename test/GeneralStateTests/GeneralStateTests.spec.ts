import { expect } from 'chai';
import { hexToBigInt, logsToHash } from 'test/helpers';
import { hexToBuffer, loadTestCases } from 'test/helpers';
import { testConfig } from 'test/vm/TestConfig';
import { TestsJSON, TransactionJSON, PostStateJSON } from 'test/GeneralStateTests/TestsJSON';
import { VM } from 'src/VM';
import { TestStorage } from 'test/vm/TestStorage';
import { TestContext } from 'test/GeneralStateTests/TestContext';
import { Transaction } from 'ethereumjs-tx';
import { Message } from 'src/Message';
import { GasPool } from 'src/GasPool';
import { State } from 'src/interpreter/State';
import { opCodeToString } from 'src/interpreter/OpCode';

const TEST_CASES = [
    'GeneralStateTests/stArgsZeroOneBalance',
    // 'GeneralStateTests/stAttackTest', // ?
    // 'GeneralStateTests/stBadOpcode',
    // 'GeneralStateTests/stBugs',
    // 'GeneralStateTests/stCallCodes', // ?
    // 'GeneralStateTests/stCallCreateCallCodeTest', // ?
    // 'GeneralStateTests/stCallDelegateCodesCallCodeHomestead',
    // 'GeneralStateTests/stCallDelegateCodesHomestead',
    // 'GeneralStateTests/stChangedEIP150', // ?
    // 'GeneralStateTests/stCodeCopyTest',
    // 'GeneralStateTests/stCodeSizeLimit',
    // 'GeneralStateTests/stCreate2', // ?
    // 'GeneralStateTests/stCreateTest', // ?
    // 'GeneralStateTests/stDelegatecallTestHomestead', // ?
    // 'GeneralStateTests/stEIP150Specific', // ?
    // 'GeneralStateTests/stEIP150singleCodeGasPrices', // ?
    // 'GeneralStateTests/stEIP158Specific', // ?
    // 'GeneralStateTests/stExtCodeHash', // ?
    // 'GeneralStateTests/stHomesteadSpecific',
    // 'GeneralStateTests/stInitCodeTest', // ?
    // 'GeneralStateTests/stLogTests', // ?
    // 'GeneralStateTests/stMemExpandingEIP150Calls', // ?
    // 'GeneralStateTests/stMemoryStressTest',
    // 'GeneralStateTests/stMemoryTest',
    // 'GeneralStateTests/stNonZeroCallsTest', // ?
    // 'GeneralStateTests/stPreCompiledContracts', // ?
    
];

const FORC = 'ConstantinopleFix';

TEST_CASES.forEach(testCasesName => {
    describe(testCasesName, () => {
        const cases = loadTestCases<TestsJSON>(testCasesName);

        cases.forEach(item => {
            for (let [testName, test] of Object.entries(item)) {

                if (!Array.isArray(test.post[FORC])) {
                    return;
                }

                for (let post of test.post[FORC].slice(1, 2)) {
                    it(testName, async () => {

                        const storage = new TestStorage(test.pre);
                        const message = makeMessage(test.transaction, post);
                        const context = new TestContext(message, test);
                        const vm = new VM(context, storage, testConfig);
                        const gasPool = new GasPool(context.gasLimit);

                        // vm.on('step', (state: State) => {
                        //     console.log(opCodeToString(state.opCode), state.contract.gas, state.stack.length);
                        // });

                        // vm.on('vmerror', (error: Error) => {
                        //     console.log(error);
                        // });

                        // vm.on('sstore', (data: any) => {
                        //     console.log(data);
                        // });

                        const snapshot = storage.snapshot();

                        const result = await vm.applyMessage(message, gasPool);

                        if (result.error) {
                            storage.revertToSnapshot(snapshot);
                        }

                        // storage.print();

                        const tree = await storage.toMerklePatriciaTree();
                        const logs = logsToHash(storage.logs());

                        const expectHash = hexToBuffer(post.hash);
                        const expectLogs = hexToBuffer(post.logs);

                        expect(
                            expectHash.equals(tree.root),
                            `post state root mismatch: got ${tree.root.toString('hex')}, want ${expectHash.toString('hex')}`
                        ).to.equal(true);

                        expect(
                            expectLogs.equals(logs),
                            `post state logs hash mismatch: got ${logs.toString('hex')}, want ${expectLogs.toString('hex')}`
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
        to: txJSON.to === '' ? null : hexToBuffer(txJSON.to),
        gasPrice: hexToBigInt(txJSON.gasPrice),
        gas,
        value,
        nonce: hexToBigInt(txJSON.nonce),
        data
    };
};
