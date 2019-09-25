import { State } from 'src/State';
import { VmStop } from 'src/exceptions';
import { U256 } from 'src/U256';

export const opTemp = (state: State) => {

}

export const opStop = (state: State) => {
	// TODO
	throw new VmStop();
}

export const opAdd = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = BigInt.asUintN(256, a + b);
	state.stack.push(r);
}

export const opMul = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = BigInt.asUintN(256, a * b);
	state.stack.push(r);
}

export const opSub = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = BigInt.asUintN(256, a - b);
	state.stack.push(r);
}

export const opDiv = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = b === 0n
		? 0n
		: BigInt.asUintN(256, a / b);
	state.stack.push(r);
}

export const opSdiv = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = b === 0n
		? 0n
		: BigInt.asUintN(256, BigInt.asIntN(256, a) / BigInt.asIntN(256, b));
	state.stack.push(r);
}

export const opMod = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = b === 0n
		? 0n
		: BigInt.asUintN(256, a % b);
	state.stack.push(r);
}

export const opSmod = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = b === 0n
		? 0n
		: BigInt.asUintN(256, BigInt.asIntN(256, a) % BigInt.asIntN(256, b));
	state.stack.push(r);
}

export const opAddmod = (state: State) => {
	const [a, b, c] = state.stack.popN(3);
	const r = c === 0n
		? 0n
		: BigInt.asUintN(256, (a + b) % c);

	state.stack.push(r);
}

export const opMulmod = (state: State) => {
	const [a, b, c] = state.stack.popN(3);
	const r = c === 0n
		? 0n
		: BigInt.asUintN(256, (a * b) % c);

	state.stack.push(r);
}

export const opExp = (state: State) => {
	const [base, exponent] = state.stack.popN(2);
	const r = U256.expmod(base, exponent);
	state.stack.push(r);
}

export const opSignExtend = (state: State) => {
	const [k, value] = state.stack.popN(2);

	if (k < 31n) {
		const bit = k * 8n + 7n;
		const mask = (1n << bit) - 1n;

		const r = Number(value.toString(2)[Number(bit)]) > 0
			? value | (~mask)
			: value & mask;

		state.stack.push(BigInt.asUintN(256, r));
		return
	}

	state.stack.push(value);
}

export const opLt = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = a < b ? 1n : 0n;
	state.stack.push(r);
}

export const opGt = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = a > b ? 1n : 0n;
	state.stack.push(r);
}

export const opSlt = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = BigInt.asIntN(256, a) < BigInt.asIntN(256, b) ? 1n : 0n;
	state.stack.push(r);
}

export const opSgt = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = BigInt.asIntN(256, a) > BigInt.asIntN(256, b) ? 1n : 0n;
	state.stack.push(r);
}

export const opEq = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = a === b ? 1n : 0n;
	state.stack.push(r);
}

export const opIszero = (state: State) => {
	const a = state.stack.pop();
	const r = a === 0n ? 1n : 0n;
	state.stack.push(r);
}

export const opAnd = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = a & b;
	state.stack.push(r);
}

export const opOr = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = a | b;
	state.stack.push(r);
}

export const opXor = (state: State) => {
	const [a, b] = state.stack.popN(2);
	const r = a ^ b;
	state.stack.push(r);
}

export const opNot = (state: State) => {
	const a = state.stack.pop();
	const r = BigInt.asUintN(256, ~a);
	state.stack.push(r);
}

export const opByte = (state: State) => {
	const [pos, word] = state.stack.popN(2);
	const r = pos < 32n
		? (word >> (248n - pos * 8n)) & BigInt('0xFF')
		: 0n;

	state.stack.push(r);
}

export const opSHL = (state: State) => {
	const [shift, value] = state.stack.popN(2);
	const r = shift < 256n
		? BigInt.asUintN(256, value << shift)
		: 0n;

	state.stack.push(r);
}

export const opSHR = (state: State) => {
	const [shift, value] = state.stack.popN(2);
	const r = shift < 256n
		? BigInt.asUintN(256, value >> shift)
		: 0n;

	state.stack.push(r);
}

export const opSAR = (state: State) => {
	const [shift, value] = state.stack.popN(2);

	if (shift < 256n) {
		const r = BigInt.asUintN(256, BigInt.asIntN(256, value) >> shift);
		state.stack.push(r);
	} else {
		const isSigned = BigInt.asIntN(256, value) >= 0;
		const r = BigInt.asUintN(256, isSigned ? 0n : -1n);
		state.stack.push(r);
	}
}

export const opSha3 = (state: State) => {

}

export const opPush = (state: State) => {
	const numToPush = state.opCode - 0x5f;

	const value = state.code
		.slice(state.programCounter, state.programCounter + numToPush)
		.toString('hex');

	state.programCounter += numToPush;
	state.stack.push(BigInt(`0x${value}`));
}

