import fs from 'fs';

export const TESTDATA_ETHEREUM_FOLDER = 'test/testdata-ethereum';

export type Path<T> = {
    path: string;
    data: T
};

export type TestMatcherProcess<File, Json> = (file: Path<File>) => Generator<Path<Json>>;

export class TestMatcher<File, Json> {

    private folder: string;

    private skipTests: Array<RegExp>;

    private processFunc: TestMatcherProcess<File, Json>;

    constructor(folder: string) {
        this.folder = folder;
        this.skipTests = [];
    }

    get name(): string {
        return this.folder;
    } 

    skip(path: string) {
        this.skipTests.push(new RegExp(path));
    }

    private isSkip(path: string): boolean {
        return this.skipTests.some(reg => reg.test(path));
    }

    process(processFunc: TestMatcherProcess<File, Json>) {
        this.processFunc = processFunc;
    }

    private *loadTests(): Iterable<Path<File>> {
        const path = `${TESTDATA_ETHEREUM_FOLDER}/${this.folder}`;
        for (const folder of fs.readdirSync(path)) {
            const folderPath = `${path}/${folder}`;
            for (const file of fs.readdirSync(folderPath)) {
                if (file.endsWith('json')) {
                    const filePath = `${folderPath}/${file}`;
                    const txt = fs.readFileSync(filePath, 'utf8');
                    yield {
                        path: `${folder}/${file}`.replace(/\.json$/, ''),
                        data: JSON.parse(txt)
                    };
                }
            }
        }
    }

    private *tests(): Iterable<Path<Json>> {
        for (const testCases of this.loadTests()) {
            yield* this.processFunc(testCases);
        }
    }

    *[Symbol.iterator](): IterableIterator<Path<Json>> {
        for (const test of this.tests()) {
            if (!this.isSkip(test.path)) {
                yield test;
            }
        }
    }

    *force(path: string): Iterable<Path<Json>> {
        const reg = new RegExp(path);

        for (const test of this.tests()) {
            if (reg.test(test.path)) {
                yield test;
            }
        }
    }
}

