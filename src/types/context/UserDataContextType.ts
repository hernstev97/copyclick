import type { SnippetDataType } from '../SnippetDataType';

export type UserDataContextType = {
    items: SnippetDataType[];
    addItem: (item: SnippetDataType) => void;
    removeItem: (id: string) => void;
    updateItem: (item: SnippetDataType) => void;
    reorderItems: (newOrder: SnippetDataType[]) => void;
    clearItems: () => void;
};