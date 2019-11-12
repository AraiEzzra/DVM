import { TestMatcher } from 'test/runner/TestMatcher';

export type TestMatcherItemRun<T> = {
    (path: string, test: T): Promise<void>;
};

export type TestMatcherItem<File, Json> = {
    testMatcher: TestMatcher<File, Json>;
    run: TestMatcherItemRun<Json>;
};

export interface ITestRunnerProvider {
    addDescribe(title: string): IDescribe;
    run(): void;
}

export interface IDescribe {
    addTest(title: string, test: ITest): void;
}

export interface ITest {
    (): PromiseLike<void>; 
}
