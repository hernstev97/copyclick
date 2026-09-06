import type { StorageStatus } from '../../utils/storage';
import type { Language } from '../../utils/content';
import type { SnippetDataType } from '../SnippetDataType';

/**
 * Context type for user data and app state management.
 */
export interface UserDataContextType {
    /** The current language code (e.g., 'en', 'de'). */
    language: Language;

    /** Set the current language. */
    setLanguage: (language: Language) => void;

    /** All snippet items currently in the app. */
    items: ReadonlyArray<SnippetDataType>;

    /** Add a new snippet item. */
    addItem: (item: SnippetDataType) => void;

    /** Remove a snippet item by its unique ID. */
    removeItem: (id: string) => void;

    /** Update an existing snippet item. */
    updateItem: (item: SnippetDataType) => void;

    /** Reorder the list of snippet items. */
    reorderItems: (newOrder: ReadonlyArray<SnippetDataType>) => void;

    storageStatus: StorageStatus;
    storedBackup: string | null;
    replaceStoredData: () => void;
    importItems: (items: SnippetDataType[]) => void;
    moveItem: (id: string, direction: -1 | 1) => void;

    /** Remove all snippet items. */
    clearItems: () => void;
}
