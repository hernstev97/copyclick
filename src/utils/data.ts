import type { SnippetDataType } from '../types/SnippetDataType';
import { CURRENT_DATA_VERSION } from './constants';

export const MAX_IMPORT_BYTES = 10 * 1024 * 1024;
export const MAX_IMPORT_ITEMS = 1000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/** Both the original array export and the versioned storage envelope are supported. */
export function parseSnippets(
    json: string,
    importing = false
): SnippetDataType[] {
    if (importing && new Blob([json]).size > MAX_IMPORT_BYTES) {
        throw new Error('Import exceeds 10 MiB');
    }
    const data: unknown = JSON.parse(json);
    let items: unknown;
    if (Array.isArray(data)) {
        items = data;
    } else if (isRecord(data) && data.version === CURRENT_DATA_VERSION) {
        items = data.items;
    } else {
        throw new Error('Unsupported data version');
    }
    if (
        !Array.isArray(items) ||
        (importing && items.length > MAX_IMPORT_ITEMS)
    ) {
        throw new Error('Invalid snippet collection');
    }
    const ids = new Set<string>();
    return items.map((item: unknown) => {
        if (
            !isRecord(item) ||
            typeof item.id !== 'string' ||
            !item.id.trim() ||
            typeof item.title !== 'string' ||
            typeof item.text !== 'string' ||
            typeof item.editState !== 'boolean' ||
            ids.has(item.id)
        ) {
            throw new Error('Invalid or duplicate snippet');
        }
        ids.add(item.id);
        // Text is data, never HTML. Do not sanitize away the user's code or markup.
        // Pick fields explicitly rather than copying arbitrary imported properties.
        return {
            id: item.id,
            title: item.title,
            text: item.text,
            editState: item.editState,
        };
    });
}

export const serializeSnippets = (items: ReadonlyArray<SnippetDataType>) =>
    JSON.stringify({ version: CURRENT_DATA_VERSION, items });

export function downloadJson(content: string, filename: string) {
    const url = URL.createObjectURL(
        new Blob([content], { type: 'application/json;charset=utf-8' })
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    // Let the browser start consuming the URL before revoking it.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
