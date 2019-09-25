import {stringToOp} from 'src/OpCode';

export const compile = (code: string): Buffer => {
    const items = code.split(/\s+/).map(item => {
        if (item) {
            const n = stringToOp(item) || Number(item);
            return n.toString(16).padStart(2, '0');
        }
        return '';
    });

    return Buffer.from(items.join(''), 'hex');
}

