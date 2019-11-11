import { TestFile, TestJSON } from 'test/VMTests/TestsJSON';
import { TestMatcher, Path } from 'test/runner/TestMatcher';

export const testMatcher = new TestMatcher<TestFile, TestJSON>('VMTests');

testMatcher.process(function* (file: Path<TestFile>) {
    for (const data of Object.values(file.data)) {
        yield {
            path: file.path,
            data
        };
    }
});

testMatcher.skip('vmPerformance/*');

// old gas policy
testMatcher.skip('vmPushDupSwapTest/push32AndSuicide');
testMatcher.skip('vmSystemOperations/suicide0');
testMatcher.skip('vmSystemOperations/suicideNotExistingAccount');
testMatcher.skip('vmSystemOperations/suicideSendEtherToMe');
testMatcher.skip('vmTests/suicide');
