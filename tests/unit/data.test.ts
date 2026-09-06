import { describe, expect, it } from 'vitest';
import {
    MAX_IMPORT_BYTES,
    MAX_IMPORT_ITEMS,
    parseSnippets,
    serializeSnippets,
} from '../../src/utils/data';

const snippet = {
    id: 'one',
    title: '<title> & "',
    text: '<script>alert(1)</script>\n<img src=x onerror=alert(1)>\n& < >',
    editState: false,
};
describe('snippet boundary', () => {
    it('round-trips plaintext exactly in the versioned format', () => {
        expect(parseSnippets(serializeSnippets([snippet]), true)).toEqual([
            snippet,
        ]);
    });
    it('reads original array exports and legacy storage without discarding markup', () => {
        expect(parseSnippets(JSON.stringify([snippet]), true)).toEqual([
            snippet,
        ]);
    });
    it.each([
        'null',
        '{}',
        '{broken',
        '"hello"',
        JSON.stringify({ version: 'future', items: [snippet] }),
        JSON.stringify({ version: '1.0.0', items: {} }),
        JSON.stringify([snippet, { ...snippet, text: 42 }]),
        JSON.stringify([snippet, snippet]),
        JSON.stringify([{ ...snippet, id: '' }]),
        JSON.stringify([{ ...snippet, editState: 'false' }]),
    ])('rejects invalid data atomically: %s', (json) => {
        expect(() => parseSnippets(json, true)).toThrow();
    });
    it('drops unknown fields including prototype-like keys', () => {
        const json =
            '[{"id":"one","title":"plain","text":"text","editState":false,"__proto__":{"polluted":true},"extra":"value"}]';
        expect(Object.keys(parseSnippets(json)[0])).toEqual([
            'id',
            'title',
            'text',
            'editState',
        ]);
        expect(Object.prototype).not.toHaveProperty('polluted');
    });
    it('bounds import bytes and item counts before adding snippets', () => {
        expect(() =>
            parseSnippets(' '.repeat(MAX_IMPORT_BYTES + 1), true)
        ).toThrow();
        expect(() =>
            parseSnippets(
                JSON.stringify(
                    Array.from(
                        { length: MAX_IMPORT_ITEMS + 1 },
                        (_, index) => ({ ...snippet, id: String(index) })
                    )
                ),
                true
            )
        ).toThrow();
    });
});
