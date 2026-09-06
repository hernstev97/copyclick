import { useState, useRef, useEffect, type ReactNode } from 'react';
import type { SnippetDataType } from '../types/SnippetDataType';
import { LANGUAGE_KEY } from '../utils/constants';
import type { Language } from '../utils/content';
import { UserDataContext } from '../hooks/useData';
import {
    loadData,
    saveData,
    readPreference,
    writePreference,
} from '../utils/storage';

export function UserDataProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>(() =>
        readPreference(LANGUAGE_KEY) === 'de' ? 'de' : 'en'
    );
    const [data, setData] = useState(loadData);
    const current = useRef(data);

    useEffect(() => {
        document.documentElement.lang = language;
    }, [language]);

    // Persistence happens on user actions, never inside a state updater or mount effect.
    const change = (
        update: (items: SnippetDataType[]) => SnippetDataType[],
        replace = false
    ) => {
        const next = saveData(
            current.current,
            update(current.current.items),
            replace
        );
        current.current = next;
        setData(next);
    };

    return (
        <UserDataContext.Provider
            value={{
                language,
                setLanguage: (value) => {
                    writePreference(LANGUAGE_KEY, value);
                    setLanguage(value);
                },
                items: data.items,
                storageStatus: data.status,
                storedBackup: data.raw,
                replaceStoredData: () => change((items) => items, true),
                addItem: (item) => change((items) => [...items, item]),
                importItems: (imported) =>
                    change((items) => [
                        ...items,
                        ...imported.map((item) => ({
                            ...item,
                            id: crypto.randomUUID(),
                        })),
                    ]),
                removeItem: (id) =>
                    change((items) => items.filter((item) => item.id !== id)),
                updateItem: (item) =>
                    change((items) =>
                        items.map((existing) =>
                            existing.id === item.id ? item : existing
                        )
                    ),
                reorderItems: (items) => change(() => [...items]),
                moveItem: (id, direction) =>
                    change((items) => {
                        const index = items.findIndex((item) => item.id === id);
                        const target = index + direction;
                        if (index < 0 || target < 0 || target >= items.length)
                            return items;
                        const reordered = [...items];
                        [reordered[index], reordered[target]] = [
                            reordered[target],
                            reordered[index],
                        ];
                        return reordered;
                    }),
                clearItems: () => change(() => []),
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
}
