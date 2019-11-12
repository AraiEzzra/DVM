import { TestMatcher } from 'test/runner/TestMatcher';
import { TestMatcherItem, TestMatcherItemRun, ITestRunnerProvider } from 'test/runner/interfaces';

export type TestRunnerOptions = {
    module?: string;
    run?: string;
};

export class TestRunner {

    private testMatchers: Array<TestMatcherItem<any, any>>;

    private testRunnerProvider: ITestRunnerProvider;

    private options: TestRunnerOptions;

    constructor(testRunnerProvider: ITestRunnerProvider, options: TestRunnerOptions = {}) {
        this.testRunnerProvider = testRunnerProvider;
        this.testMatchers = [];
        this.options = options;
    }

    add<File, Json>(testMatcher: TestMatcher<File, Json>, run: TestMatcherItemRun<Json>) {
        this.testMatchers.push({ testMatcher, run });
    }

    private getRunTestMatchers(name?: string) {
        if (name) {
            return this.testMatchers.filter(item => item.testMatcher.name === name);
        }
        return this.testMatchers;
    }

    run() {
        const testMatchers = this.getRunTestMatchers(this.options.module);
        for (const { testMatcher, run } of testMatchers) {
            
            const runTestMatcher = this.options.run
                ? testMatcher.force(this.options.run)
                : testMatcher;

            const describe = this.testRunnerProvider.addDescribe(testMatcher.name);

            for (const { path, data } of runTestMatcher) {
                describe.addTest(path, async () => run(path, data));
            }
        }

        this.testRunnerProvider.run();
    }
}
