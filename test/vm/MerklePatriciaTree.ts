import SecureTrie from 'merkle-patricia-tree/secure';
import { promisify } from 'util';

export class MerklePatriciaTree {
    
    readonly trie: SecureTrie;

    constructor(trie?: SecureTrie) {
        this.trie = trie || new SecureTrie();
    }

    get root(): Buffer {
        return this.trie.root;
    }

    set root(value: Buffer) {
        this.trie.root = value;
    }

    copy(): MerklePatriciaTree {
        return new MerklePatriciaTree(this.trie.copy());
    }

    put(key: Buffer, value: Buffer) {
        return promisify(this.trie.put).bind(this.trie)(key, value);
    }

    putRaw(key: Buffer, value: Buffer) {
        return promisify(this.trie.putRaw).bind(this.trie)(key, value);
    }
}
