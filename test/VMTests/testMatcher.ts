import { TestFile, TestJSON } from 'test/VMTests/TestsJSON';
import { TestMatcher, TestMatcherFile } from 'test/utils/TestMatcher';

export const testMatcher = new TestMatcher<TestJSON>('VMTests');

testMatcher.process(function* (file: TestMatcherFile<TestFile>) {
    for (const test of Object.values(file.test)) {
        yield {
            path: file.path,
            test
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
