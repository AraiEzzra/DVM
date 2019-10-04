import fs from 'fs';
import { VmJSON } from 'test/vm/VmJSON';

export const hexToBuffer = (str: string, size: number = 0): Buffer => {
    if (size === 0) {
        return Buffer.from(str.slice(2), 'hex');
    }

    const buffer = Buffer.alloc(size);
    const hex = str.slice(2).padStart(2 * size, '0');
    buffer.write(hex, 'hex');

    return buffer;
};

export const TESTDATA_ETHEREUM_FOLDER = 'test/testdata-ethereum/VMTests';

export const loadTestCases = (name: string): Array<VmJSON> => {
    const path = `${TESTDATA_ETHEREUM_FOLDER}/${name}`;
    const files = fs.readdirSync(path);
    return files.map(file => {
        const txt = fs.readFileSync(`${path}/${file}`, 'utf8');
        return JSON.parse(txt);
    });
};
