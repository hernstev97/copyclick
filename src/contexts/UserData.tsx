import React from 'react';
import { useState, useEffect, useContext } from 'react';
import DOMPurify from 'dompurify';
import type { SnippetDataType } from '../types/SnippetDataType';
import type { UserDataContextType } from '../types/context/UserDataContextType';
import { CURRENT_DATA_VERSION, LANGUAGE_KEY, STORAGE_KEY, VERSION_MISMATCH_MESSAGE } from '../utils/constants';
import type { Language } from '../utils/content';

// Configure DOMPurify to be more permissive with HTML but still safe
const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [
            'a', 'b', 'blockquote', 'code', 'em', 'i', 'li', 'ol', 'strong', 'ul',
            'p', 'br', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'table', 'thead', 'tbody', 'tr', 'th', 'td'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'id', 'style']
    });
};

const UserDataContext = React.createContext<UserDataContextType | undefined>(
    undefined
);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [language, setLanguage] = useState<Language>('en');
    const [items, setItems] = useState<SnippetDataType[]>(() => {
        const storedData = localStorage.getItem(STORAGE_KEY);

        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                
                // Check if we have the new format with version
                if (parsedData.version === CURRENT_DATA_VERSION) {
                    // Sanitize stored data when loading
                    return parsedData.items.map((item: SnippetDataType) => ({
                        ...item,
                        title: sanitizeInput(item.title),
                        text: sanitizeInput(item.text)
                    }));
                }

                // If we have old data, clear it and show a notification
                localStorage.removeItem(STORAGE_KEY);
                alert(VERSION_MISMATCH_MESSAGE);
                return [];
            } catch (error) {
                console.error('Failed to parse items from localStorage:', error);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        // Store data with version
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            version: CURRENT_DATA_VERSION,
            items
        }));
    }, [items]);

    const addItem = (item: SnippetDataType) => {
        // Sanitize input before adding
        const sanitizedItem = {
            ...item,
            title: sanitizeInput(item.title),
            text: sanitizeInput(item.text)
        };
        setItems((items) => [...items, sanitizedItem]);
    };

    const removeItem = (id: string) => {
        setItems((items) => items.filter((item) => item.id !== id));
    };

    const updateItem = (item: SnippetDataType) => {
        // Sanitize input before updating
        const sanitizedItem = {
            ...item,
            title: sanitizeInput(item.title),
            text: sanitizeInput(item.text)
        };
        setItems((items) =>
            items.map((existingItem) =>
                existingItem.id === sanitizedItem.id ? sanitizedItem : existingItem
            )
        );
    };

    const reorderItems = (newOrder: ReadonlyArray<SnippetDataType>) => {
        setItems(newOrder as SnippetDataType[]);
    };

    const clearItems = () => {
        setItems([]);
    };

    const handleSetLanguage = (language: Language) => {
        localStorage.setItem(LANGUAGE_KEY, language);
        setLanguage(language);
    };

    return (
        <UserDataContext.Provider
            value={{
                language,
                setLanguage: handleSetLanguage,
                items,
                addItem,
                removeItem,
                updateItem,
                reorderItems,
                clearItems
            }}
        >
            {children}
        </UserDataContext.Provider>
    );
};

// Custom hook to use the user data context
export const useData = () => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a UserDataProvider');
    }
    return context;
};