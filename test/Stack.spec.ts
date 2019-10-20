import { Stack } from 'src/interpreter/Stack';
import { PARAMS } from 'src/Config';
import { U256 } from 'src/interpreter/U256';
import { expect } from 'chai';

describe('Stack', () => {

    it('should push item', () => {
        const stack = new Stack(PARAMS.StackLimit);
        const value = BigInt(5);

        stack.push(value);

        expect(stack.pop()).to.equal(value);
    });

    it('should swap top with itself', () => {
        const stack = new Stack(PARAMS.StackLimit);
        const value = BigInt(5);

        stack.push(value);
        stack.swap(0);

        expect(stack.pop()).to.equal(value);
    });

    it('should swap', () => {
        const stack = new Stack(PARAMS.StackLimit);
        const value1 = BigInt(5);
        const value2 = BigInt(7);

        stack.push(value1);
        stack.push(value2);
        stack.swap(1);

        expect(stack.pop()).to.equal(value1);
        expect(stack.pop()).to.equal(value2);
    });

    it('should dup', () => {
        const stack = new Stack(PARAMS.StackLimit);
        const value1 = BigInt(5);
        const value2 = BigInt(7);

        stack.push(value1);
        stack.push(value2);
        stack.dup(2);

        expect(stack.pop()).to.equal(value1);
        expect(stack.pop()).to.equal(value2);
    });

});
