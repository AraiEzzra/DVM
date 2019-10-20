import SecureTrie from 'merkle-patricia-tree/secure';
import { promisify } from 'util';

export class MerklePatriciaTree {
    
    private trie: SecureTrie;

    constructor() {
        this.trie = new SecureTrie();

        // TODO add event
        // const put = this.trie.put.bind(this.trie);
        // this.trie.put = (key, value, cb) => {
        //   put(key, value, (...args) => {
        //     console.log('put', this.trie.root.toString('hex'), key.toString('hex'), value.toString('hex'))
        //     cb(...args);
        //   })
        // }
    }

    get root(): Buffer {
        return this.trie.root;
    }

    copy(): SecureTrie {
        return this.trie.copy();
    }

    put(key: Buffer, value: Buffer) {
        return promisify(this.trie.put).bind(this.trie)(key, value);
    }

    putRaw(key: Buffer, value: Buffer) {
        return promisify(this.trie.putRaw).bind(this.trie)(key, value);
    }
}
