import { hexToBigInt, hexToBuffer } from 'test/utils';
import { TransactionJSON, PostStateJSON } from 'test/GeneralStateTests/TestsJSON';
import { Transaction } from 'ethereumjs-tx';
import { Message } from 'src/Message';

export const makeMessage = (txJSON: TransactionJSON, post: PostStateJSON): Message => {

    if (post.indexes.data > txJSON.data.length) {
        throw new Error(`tx data index ${post.indexes.data} out of bounds`);
    }

    if (post.indexes.value > txJSON.value.length) {
        throw new Error(`tx value index ${post.indexes.value} out of bounds`);
    }

    if (post.indexes.gas > txJSON.gasLimit.length) {
        throw new Error(`tx gas index ${post.indexes.gas} out of bounds`);
    }

    const data = hexToBuffer(txJSON.data[post.indexes.data]);
    const value = hexToBigInt(txJSON.value[post.indexes.value]);
    const gas = hexToBigInt(txJSON.gasLimit[post.indexes.gas]);
    
    // TODO replace to crypto.ToECDSA
    const transaction = new Transaction();
    transaction.sign(hexToBuffer(txJSON.secretKey));
   
    return {
        from: transaction.getSenderAddress(),
        to: txJSON.to === '' ? null : hexToBuffer(txJSON.to),
        gasPrice: hexToBigInt(txJSON.gasPrice),
        gas,
        value,
        nonce: hexToBigInt(txJSON.nonce),
        data,
        checkNonce: true
    };
};
