import React from 'react';
import { useState, useEffect, useContext } from 'react';

type CopyAreaDataType = {
    id: number;
    title: string;
    text: string;
    editState: boolean;
};

type UserDataContextType = {
    items: CopyAreaDataType[];
    addItem: (item: CopyAreaDataType) => void;
    removeItem: (id: number) => void;
    updateItem: (item: CopyAreaDataType) => void;
    clearItems: () => void;
};

const UserDataContext = React.createContext<UserDataContextType | undefined>(
    undefined
);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [items, setItems] = useState<CopyAreaDataType[]>(() => {
        const storedItems = localStorage.getItem('copyClickItems');

        if (storedItems) {
            try {
                const parsedItems = JSON.parse(storedItems);
                if (Array.isArray(parsedItems)) {
                    return parsedItems; // Return the loaded items as the initial state
                } else {
                    console.warn(
                        'useState initializer: Stored data is not an array. Initializing to empty.'
                    );
                    return [];
                }
            } catch (error) {
                console.error(
                    'useState initializer: Failed to parse items from localStorage. Initializing to empty.',
                    error
                );
                return []; // Default to empty array on error
            }
        } else {
            console.log(
                'useState initializer: No items found in localStorage. Initializing to empty.'
            );
            return []; // Default to empty array if nothing is stored
        }
    });

    useEffect(() => {
        localStorage.setItem('copyClickItems', JSON.stringify(items));
    }, [items]);

    const addItem = (item: CopyAreaDataType) => {
        setItems((items) => [...items, item]);
    };

    const removeItem = (id: number) => {
        setItems((items) => items.filter((item) => item.id !== id));
    };

    const updateItem = (item: CopyAreaDataType) => {
        setItems((items) =>
            items.map((existingItem) =>
                existingItem.id === item.id ? item : existingItem
            )
        );
    };

    const clearItems = () => {
        console.log('clearing items');
        setItems([]);
    };

    return (
        <UserDataContext.Provider
            value={{ items, addItem, removeItem, updateItem, clearItems }}
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
