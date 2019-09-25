import { Stack } from 'src/Stack';
import { STACK_MAX_SIZE, STACK_MAX_VALUE } from 'src/constants';
import { expect } from 'chai';

describe('Stack', () => {

    it('should be empty initially', () => {
        const stack = new Stack();

        expect(stack.length).to.equal(0);
        expect(() => stack.pop()).to.throw();
    });

    it('popN should throw for empty stack', () => {
        const stack = new Stack();

        expect(stack.popN(0)).to.deep.equal([]);
        expect(() => stack.popN(1)).to.throw();
    });

    it('should push item', () => {
        const stack = new Stack();
        const value = BigInt(5);

        stack.push(value);

        expect(stack.pop()).to.equal(value);
    });

    it('popN should return array for n = 1', () => {
        const stack = new Stack();
        const value = BigInt(5);

        stack.push(value);

        expect(stack.popN(1)).to.deep.equal([value]);
    });

    it('popN should fail on underflow', () => {
        const stack = new Stack();
        const value = BigInt(5);

        stack.push(value);

        expect(() => stack.popN(2)).to.throw();
    });

    it('popN should return in correct order', () => {
        const stack = new Stack();
        const value1 = BigInt(5);
        const value2 = BigInt(7);

        stack.push(value1);
        stack.push(value2);

        expect(stack.popN(2)).to.deep.equal([value2, value1]);
    });

    it('should throw on overflow', () => {
        const stack = new Stack();
        for (let i=0; i < STACK_MAX_SIZE; i++) {
            stack.push(BigInt(1));
        }

        expect(() => stack.push(BigInt(1))).to.throw();
    });

    it('should swap top with itself', () => {
        const stack = new Stack();
        const value = BigInt(5);

        stack.push(value);
        stack.swap(0);

        expect(stack.pop()).to.equal(value);
    });

    it('swap should throw on underflow', () => {
        const stack = new Stack();
        const value = BigInt(5);

        stack.push(value);

        expect(() => stack.swap(2)).to.throw();
    });

    it('should swap', () => {
        const stack = new Stack();
        const value1 = BigInt(5);
        const value2 = BigInt(7);

        stack.push(value1);
        stack.push(value2);
        stack.swap(1);

        expect(stack.pop()).to.equal(value1);
        expect(stack.pop()).to.equal(value2);
    });

    it('swap should throw on underflow', () => {
        const stack = new Stack();
        const value = BigInt(5);

        expect(() => stack.dup(1)).to.throw();
        stack.push(value);
        expect(() => stack.dup(2)).to.throw();
    });

    it('should dup', () => {
        const stack = new Stack();
        const value1 = BigInt(5);
        const value2 = BigInt(7);

        stack.push(value1);
        stack.push(value2);
        stack.dup(2);

        expect(stack.pop()).to.equal(value1);
        expect(stack.pop()).to.equal(value2);
    });

    it('should validate value overflow', () => {
        const stack = new Stack();

        expect(() => stack.push(STACK_MAX_VALUE + BigInt(1))).to.throw();
    });

});
