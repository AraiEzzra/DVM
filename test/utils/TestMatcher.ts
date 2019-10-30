import fs from 'fs';

export const TESTDATA_ETHEREUM_FOLDER = 'test/testdata-ethereum';

export type TestMatcherFile<T> = {
    path: string;
    test: T
};

// TODO replace any to Generator type
export type TestMatcherProcess<T> = any;

export class TestMatcher<T> {

    private folder: string;

    private skipTests: Array<RegExp>;

    private processFunc: TestMatcherProcess<T>;

    constructor(folder: string) {
        this.folder = folder;
        this.skipTests = [];
    }

    skip(path: string) {
        this.skipTests.push(new RegExp(path));
    }

    private isSkip(path: string): boolean {
        return this.skipTests.some(reg => reg.test(path));
    }

    process(processFunc: TestMatcherProcess<T>) {
        this.processFunc = processFunc;
    }

    private *loadTests(): Iterable<TestMatcherFile<T>> {
        const path = `${TESTDATA_ETHEREUM_FOLDER}/${this.folder}`;
        for (const folder of fs.readdirSync(path)) {
            const folderPath = `${path}/${folder}`;
            for (const file of fs.readdirSync(folderPath)) {
                if (file.endsWith('json')) {
                    const filePath = `${folderPath}/${file}`;
                    const txt = fs.readFileSync(filePath, 'utf8');
                    yield {
                        path: `${folder}/${file}`.replace(/\.json$/, ''),
                        test: JSON.parse(txt)
                    };
                }
            }
        }
    }

    private *tests() {
        for (const testCases of this.loadTests()) {
            yield* this.processFunc(testCases);
        }
    }

    *[Symbol.iterator](): IterableIterator<TestMatcherFile<T>> {
        for (const test of this.tests()) {
            if (!this.isSkip(test.path)) {
                yield test;
            }
        }
    }

    *force(path: string) {
        const reg = new RegExp(path);

        for (const test of this.tests()) {
            if (reg.test(test.path)) {
                yield test;
            }
        }
    }
}

