import { compile } from 'src/compile';
import { expect } from 'chai';

describe('compile', () => {

    it('PUSH1 PUSH1 ADD', () => {
        const asm = compile('PUSH1 0x05 PUSH1 0x04 ADD').toString('hex');

        expect(asm).to.equal('6005600401');
    })

    it('PUSH1 PUSH1 ADD MSTORE RETURN', () => {
        const asm = compile('PUSH1 0x05 PUSH1 0x04 ADD PUSH1 0x00 MSTORE PUSH1 0x01 PUSH1 0x1f RETURN').toString('hex');

        expect(asm).to.equal('60056004016000526001601ff3');
    })

    it('PUSH1 CALLDATALOAD PUSH1 CALLDATALOAD ADD', () => {
        const asm = compile('PUSH1 0x00 CALLDATALOAD PUSH1 0x20 CALLDATALOAD ADD').toString('hex');

        expect(asm).to.equal('60003560203501');
    })

    it('PUSH2 PUSH6 ADD', () => {
        const asm = compile('PUSH2 0x1002 PUSH6 0x123456789009 ADD').toString('hex');

        expect(asm).to.equal('6110026512345678900901');
    })

    it('PUSH1 CALLDATALOAD PUSH1 MSTORE JUMPDEST ...', () => {
        const asm = compile(`
            PUSH1 0x00
            CALLDATALOAD
            PUSH1 0x00
            MSTORE
            JUMPDEST
            PUSH1 0x01
            PUSH1 0x00
            MLOAD
            SUB
            PUSH1 0x00
            MSTORE
            PUSH1 0x00
            MLOAD
            PUSH1 0x06
            JUMPI
        `).toString('hex');

        expect(asm).to.equal('6000356000525b600160005103600052600051600657');
    })
});
