import Mocha from 'mocha';
import { ITestRunnerProvider, IDescribe, ITest } from 'test/runner/interfaces';

export class MochaDescribe implements IDescribe {

    private suite: Mocha.Suite;

    constructor(suite: Mocha.Suite, title: string) {
        this.suite = Mocha.Suite.create(suite, title);
    }

    addTest(title: string, test: ITest): void {
        this.suite.addTest(new Mocha.Test(title, test));
    }
}

export class MochaTestRunnerProvider implements ITestRunnerProvider {

    private mocha: Mocha;

    constructor(options?: Mocha.MochaOptions) {
        this.mocha = new Mocha(options);
    }

    addDescribe(title: string): IDescribe {
        return new MochaDescribe(this.mocha.suite, title);
    }

    run() {
        this.mocha.run();
    }
}
