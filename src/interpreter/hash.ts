import createKeccakHash from 'keccak';

export const keccak256 = (value: Buffer): Buffer => createKeccakHash('keccak256').update(value).digest();
