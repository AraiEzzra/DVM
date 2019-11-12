import { expect } from 'chai';
import { logsToHash, hexToBuffer } from 'test/utils';
import { testConfig } from 'test/utils/TestConfig';
import { VM } from 'src/VM';
import { TestStorage } from 'test/utils/TestStorage';
import { TestContext } from 'test/GeneralStateTests/TestContext';
import { GasPool } from 'src/GasPool';
import { State } from 'src/interpreter/State';
import { opCodeToString } from 'src/interpreter/OpCode';
import { testMatcher } from 'test/GeneralStateTests/testMatcher';
import { makeMessage } from 'test/GeneralStateTests/makeMessage';
import { runner } from 'test/runner/runner';

runner.add(testMatcher, async (path, test) => {

    const storage = new TestStorage(test.pre);
    const message = makeMessage(test.transaction, test.post);
    const context = new TestContext(message, test);
    const vm = new VM(context, storage, testConfig);
    const gasPool = new GasPool(context.gasLimit);

    // vm.on('step', (state: State) => {
    //     console.log(
    //         '  '.repeat(state.vm.state.depth),
    //         opCodeToString(state.opCode),
    //         Number(state.contract.gas),
    //         // state.stack.toString()
    //     );
    // });

    // vm.on('vmerror', console.log);

    // vm.on('sstore', console.log);

    const snapshot = storage.snapshot();

    const result = await vm.applyMessage(message, gasPool);

    if (result.error) {
        storage.revertToSnapshot(snapshot);
    }

    // storage.print();
    // storage.printLogs();
    
    const tree = await storage.toMerklePatriciaTree();
    const logs = logsToHash(storage.logs());

    const expectHash = hexToBuffer(test.post.hash);
    const expectLogs = hexToBuffer(test.post.logs);

    expect(
        expectHash.equals(tree.root),
        `post state root mismatch: got ${tree.root.toString('hex')}, want ${expectHash.toString('hex')}`
    ).to.equal(true);

    expect(
        expectLogs.equals(logs),
        `post state logs hash mismatch: got ${logs.toString('hex')}, want ${expectLogs.toString('hex')}`
    ).to.equal(true);
    
});
