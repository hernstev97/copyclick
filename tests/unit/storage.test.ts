import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    loadData,
    readPreference,
    saveData,
    writePreference,
} from '../../src/utils/storage';
import { STORAGE_KEY } from '../../src/utils/constants';
import { serializeSnippets } from '../../src/utils/data';

const items = [
    { id: 'one', title: 'Snippet 1', text: 'keep me', editState: false },
];
let values: Map<string, string>;
beforeEach(() => {
    values = new Map();
    vi.stubGlobal('localStorage', {
        getItem: vi.fn((key: string) => values.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => values.set(key, value)),
    });
});
describe('non-destructive persistence', () => {
    it('does not write or erase anything on startup', () => {
        expect(loadData()).toEqual({ items: [], raw: null, status: 'ok' });
        expect(localStorage.setItem).not.toHaveBeenCalled();
    });
    it.each(['{broken', '{"version":"future","items":[]}'])(
        'preserves unreadable data and session edits: %s',
        (raw) => {
            values.set(STORAGE_KEY, raw);
            const next = saveData(loadData(), items);
            expect(next.items).toEqual(items);
            expect(next.status).toBe('invalid');
            expect(values.get(STORAGE_KEY)).toBe(raw);
            expect(localStorage.setItem).not.toHaveBeenCalled();
        }
    );
    it('loads and migrates valid legacy array data on the first actual edit', () => {
        values.set(STORAGE_KEY, JSON.stringify(items));
        const state = loadData();
        expect(state.items).toEqual(items);
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(saveData(state, items).status).toBe('ok');
        expect(values.get(STORAGE_KEY)).toBe(serializeSnippets(items));
    });
    it('reports unavailable reads without crashing', () => {
        vi.mocked(localStorage.getItem).mockImplementation(() => {
            throw new Error('blocked');
        });
        expect(loadData().status).toBe('unavailable');
        expect(readPreference('darkMode')).toBeNull();
    });
    it('keeps edits in memory on quota failure and supports retry', () => {
        const initial = loadData();
        vi.mocked(localStorage.setItem).mockImplementationOnce(() => {
            throw new Error('quota');
        });
        const failed = saveData(initial, items);
        expect(failed.items).toEqual(items);
        expect(failed.status).toBe('unavailable');
        expect(saveData(failed, items).status).toBe('ok');
    });
    it('blocks stale tab writes until explicit replacement', () => {
        const initial = loadData();
        values.set(STORAGE_KEY, 'other-tab');
        const conflict = saveData(initial, items);
        expect(conflict.status).toBe('conflict');
        expect(values.get(STORAGE_KEY)).toBe('other-tab');
        expect(saveData(conflict, items, true).status).toBe('ok');
    });
    it('does not crash when a preference cannot be saved', () => {
        vi.mocked(localStorage.setItem).mockImplementation(() => {
            throw new Error('blocked');
        });
        expect(() => writePreference('darkMode', 'true')).not.toThrow();
    });
});
