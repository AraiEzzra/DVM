import { TestRunner } from 'test/runner/TestRunner';
import { MochaTestRunnerProvider } from 'test/runner/MochaTestRunnerProvider';
import { getArgv } from 'test/utils';

export const runner = new TestRunner(new MochaTestRunnerProvider({timeout: 20000}), getArgv());
