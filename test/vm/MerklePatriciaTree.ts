import SecureTrie from 'merkle-patricia-tree/secure';
import { promisify } from 'util';

export class MerklePatriciaTree {
    
    private trie: SecureTrie;

    constructor() {
        this.trie = new SecureTrie();
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
