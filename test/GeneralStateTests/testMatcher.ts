import { TestFile, TestJSON } from 'test/GeneralStateTests/TestsJSON';
import { TestMatcher, Path } from 'test/runner/TestMatcher';

export const FORK = 'ConstantinopleFix';

export const testMatcher = new TestMatcher<TestFile, TestJSON>('GeneralStateTests');

testMatcher.process(function* (file: Path<TestFile>) {
    for (const data of Object.values(file.data)) {
        const posts = data.post[FORK];
        if (Array.isArray(posts)) {
            for (const [index, post] of posts.entries()) {
                yield {
                    path: `${file.path}/${index}`,
                    data: { ...data, post }
                };
            }
        }
    }
});

// Not supported precompiled contract
testMatcher.skip('stCreate2/create2callPrecompiles/5');
testMatcher.skip('stCreate2/create2callPrecompiles/6');
testMatcher.skip('stCreate2/create2callPrecompiles/7');

testMatcher.skip('stRevertTest/RevertPrecompiledTouch/0');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch/1');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch/2');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch/3');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_nonce/0');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_nonce/1');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_nonce/2');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_nonce/3');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_noncestorage/0');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_noncestorage/1');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_noncestorage/2');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_noncestorage/3');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_storage/0');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_storage/1');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_storage/2');
testMatcher.skip('stRevertTest/RevertPrecompiledTouch_storage/3');

testMatcher.skip('stRandom2/randomStatetest642/0');

testMatcher.skip('stStaticCall/static_CallEcrecover0_0input/5');
testMatcher.skip('stStaticCall/static_CallEcrecover0_0input/6');
testMatcher.skip('stStaticCall/static_CallEcrecover0_0input/7');
testMatcher.skip('stStaticCall/static_CallEcrecover0_0input/8');

testMatcher.skip('stSpecialTest/failed_tx_xcf416c53/0');

testMatcher.skip('stZeroKnowledge/*');
testMatcher.skip('stZeroKnowledge2/*');
