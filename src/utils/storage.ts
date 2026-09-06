import { STORAGE_KEY } from './constants';
import { parseSnippets, serializeSnippets } from './data';
import type { SnippetDataType } from '../types/SnippetDataType';

export type StorageStatus = 'ok' | 'invalid' | 'unavailable' | 'conflict';
export interface DataState {
    items: SnippetDataType[];
    raw: string | null;
    status: StorageStatus;
}

export function readPreference(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function writePreference(key: string, value: string): void {
    try {
        localStorage.setItem(key, value);
    } catch {
        /* Preference still works for this session. */
    }
}

export function loadData(): DataState {
    let raw: string | null;
    try {
        raw = localStorage.getItem(STORAGE_KEY);
    } catch {
        return { items: [], raw: null, status: 'unavailable' };
    }
    try {
        return {
            items: raw === null ? [] : parseSnippets(raw),
            raw,
            status: 'ok',
        };
    } catch {
        // Never delete or overwrite an unreadable or newer backup on startup.
        return { items: [], raw, status: 'invalid' };
    }
}

export function saveData(
    previous: DataState,
    items: SnippetDataType[],
    replace = false
): DataState {
    const next = { ...previous, items };
    if (
        !replace &&
        (previous.status === 'invalid' || previous.status === 'conflict')
    )
        return next;
    try {
        // Detect another tab's writes before replacing a stale snapshot.
        if (!replace && localStorage.getItem(STORAGE_KEY) !== previous.raw) {
            return { ...next, status: 'conflict' };
        }
        const raw = serializeSnippets(items);
        localStorage.setItem(STORAGE_KEY, raw);
        return { items, raw, status: 'ok' };
    } catch {
        return { ...next, status: 'unavailable' };
    }
}
