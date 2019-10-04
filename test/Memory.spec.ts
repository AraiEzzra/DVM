import { Memory } from 'src/interpreter/Memory';
import { expect } from 'chai';

describe('Memory', () => {

    it('empty', () => {
        const memory = new Memory();

        expect(memory.length).to.equal(0);
    });

    it('empty memory set exeption', () => {
        const memory = new Memory();

        expect(() => memory.set(0, 3, Buffer.from([1, 2, 3]))).to.throw();
    });

    it('empty memory get', () => {
        const memory = new Memory();

        expect(memory.get(0, 3)).to.deep.equals(Buffer.from([0, 0, 0]));
    });

    it('resize', () => {
        const memory = new Memory();
        memory.resize(3);
        expect(memory.length).to.equal(3);
    });


    it('memory resize set 3 byte get 3 byte', () => {
        const memory = new Memory();
        memory.resize(10);
        memory.set(0, 3, Buffer.from([3, 2, 1]));

        expect(memory.get(0, 3)).to.deep.equals(Buffer.from([3, 2, 1]));
    });


    it('memory resize set 3 byte get 2 byte', () => {
        const memory = new Memory();
        memory.resize(10);
        memory.set(0, 3, Buffer.from([3, 2, 1]));

        expect(memory.get(1, 2)).to.deep.equals(Buffer.from([2, 1]));
    });

});
