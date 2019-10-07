import chai from 'chai';
import { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);

export const isBigIntEqual = (a: bigint, b: bigint) => {
    return expect(a === b, `0x${a.toString(16)} !== 0x${b.toString(16)}`).to.true;
};
