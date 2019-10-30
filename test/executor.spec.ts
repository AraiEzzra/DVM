import { promises } from 'fs';
import { ExecutorSync } from 'src/interpreter/Instruction';
import {
    opAdd,
    opSub,
    opMul,
    opDiv,
    opSdiv,
    opMod,
    opSmod,
    opExp,
    opSignExtend,
    opLt,
    opGt,
    opSlt,
    opSgt,
    opEq,
    opAnd,
    opOr,
    opXor,
    opByte,
    opSHL,
    opSHR,
    opSAR
} from 'src/interpreter/executors';
import { State } from 'src/interpreter/State';
import { Stack } from 'src/interpreter/Stack';
import { isBigIntEqual } from 'test/utils';

const twoOpMethods = new Map<string, ExecutorSync>([
    ['add', opAdd],
    ['sub', opSub],
    ['mul', opMul],
    ['div', opDiv],
    ['sdiv', opSdiv],
    ['mod', opMod],
    ['smod', opSmod],
    ['exp', opExp],
    ['signext', opSignExtend],
    ['lt', opLt],
    ['gt', opGt],
    ['slt', opSlt],
    ['sgt', opSgt],
    ['eq', opEq],
    ['and', opAnd],
    ['or', opOr],
    ['xor', opXor],
    ['byte', opByte],
    ['shl', opSHL],
    ['shr', opSHR],
    ['sar', opSAR],
]);

const testOpFn = (stack: Array<string>, opFn: ExecutorSync, expected: string) => {
    const state = { stack: new Stack() } as State;
    stack.forEach(item => state.stack.push(BigInt(`0x${item}`)));
    opFn(state);
    isBigIntEqual(state.stack.pop(), BigInt(`0x${expected}`));
};

describe('Executors', () => {

    twoOpMethods.forEach((opFn, name) => {
        it(name, async () => {
            const txt = await promises.readFile(`test/testdata/testcases_${name}.json`, 'utf8');
            const data: Array<{ X: string, Y: string, Expected: string }> = JSON.parse(txt);

            data.forEach(item => {
                testOpFn([item.X, item.Y], opFn, item.Expected);
            });
        });
    });

    it('TestByteOp', () => {
        const testCase = [
            ['ABCDEF0908070605040302010000000000000000000000000000000000000000', '00', 'AB'],
            ['ABCDEF0908070605040302010000000000000000000000000000000000000000', '01', 'CD'],
            ['00CDEF090807060504030201ffffffffffffffffffffffffffffffffffffffff', '00', '00'],
            ['00CDEF090807060504030201ffffffffffffffffffffffffffffffffffffffff', '01', 'CD'],
            ['0000000000000000000000000000000000000000000000000000000000102030', '1F', '30'],
            ['0000000000000000000000000000000000000000000000000000000000102030', '1E', '20'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '20', '00'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'FFFFFFFFFFFFFFFF', '00'],
        ];

        testCase.forEach(([x, y, expected]) => testOpFn([x, y], opByte, expected));
    });

    it('TestSHL', () => {
        // Testcases from https://github.com/ethereum/EIPs/blob/master/EIPS/eip-145.md#shl-shift-left
        const testCase = [
            ['0000000000000000000000000000000000000000000000000000000000000001', '01', '0000000000000000000000000000000000000000000000000000000000000002'],
            ['0000000000000000000000000000000000000000000000000000000000000001', 'ff', '8000000000000000000000000000000000000000000000000000000000000000'],
            ['0000000000000000000000000000000000000000000000000000000000000001', '0100', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['0000000000000000000000000000000000000000000000000000000000000001', '0101', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '00', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '01', 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'ff', '8000000000000000000000000000000000000000000000000000000000000000'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '0100', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['0000000000000000000000000000000000000000000000000000000000000000', '01', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '01', 'fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe'],
        ];

        testCase.forEach(([x, y, expected]) => testOpFn([x, y], opSHL, expected));
    });

    it('TestSHR', () => {
        // Testcases from https://github.com/ethereum/EIPs/blob/master/EIPS/eip-145.md#shr-logical-shift-right
        const testCase = [
            ['0000000000000000000000000000000000000000000000000000000000000001', '00', '0000000000000000000000000000000000000000000000000000000000000001'],
            ['0000000000000000000000000000000000000000000000000000000000000001', '01', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['8000000000000000000000000000000000000000000000000000000000000000', '01', '4000000000000000000000000000000000000000000000000000000000000000'],
            ['8000000000000000000000000000000000000000000000000000000000000000', 'ff', '0000000000000000000000000000000000000000000000000000000000000001'],
            ['8000000000000000000000000000000000000000000000000000000000000000', '0100', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['8000000000000000000000000000000000000000000000000000000000000000', '0101', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '00', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '01', '7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'ff', '0000000000000000000000000000000000000000000000000000000000000001'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '0100', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['0000000000000000000000000000000000000000000000000000000000000000', '01', '0000000000000000000000000000000000000000000000000000000000000000'],
        ];

        testCase.forEach(([x, y, expected]) => testOpFn([x, y], opSHR, expected));
    });

    it('TestSAR', () => {
        // Testcases from https://github.com/ethereum/EIPs/blob/master/EIPS/eip-145.md#sar-arithmetic-shift-right
        const testCase = [
            ['0000000000000000000000000000000000000000000000000000000000000001', '00', '0000000000000000000000000000000000000000000000000000000000000001'],
            ['0000000000000000000000000000000000000000000000000000000000000001', '01', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['8000000000000000000000000000000000000000000000000000000000000000', '01', 'c000000000000000000000000000000000000000000000000000000000000000'],
            ['8000000000000000000000000000000000000000000000000000000000000000', 'ff', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['8000000000000000000000000000000000000000000000000000000000000000', '0100', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['8000000000000000000000000000000000000000000000000000000000000000', '0101', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '00', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '01', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'ff', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '0100', 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'],
            ['0000000000000000000000000000000000000000000000000000000000000000', '01', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['4000000000000000000000000000000000000000000000000000000000000000', 'fe', '0000000000000000000000000000000000000000000000000000000000000001'],
            ['7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'f8', '000000000000000000000000000000000000000000000000000000000000007f'],
            ['7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'fe', '0000000000000000000000000000000000000000000000000000000000000001'],
            ['7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', 'ff', '0000000000000000000000000000000000000000000000000000000000000000'],
            ['7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff', '0100', '0000000000000000000000000000000000000000000000000000000000000000'],
        ];

        testCase.forEach(([x, y, expected]) => testOpFn([x, y], opSAR, expected));
    });
});
