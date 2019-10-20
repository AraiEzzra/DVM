import { Params } from 'src/Config';
import { testConfig as commonTestConfig } from 'test/vm/TestConfig';

const params: Params = {
    ...commonTestConfig.params,
    ExpByteGas: 10n,
    SloadGas: 50n
} 

export const testConfig = { ...commonTestConfig, params };
