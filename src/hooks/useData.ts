import { createContext, useContext } from 'react';
import type { UserDataContextType } from '../types/context/UserDataContextType';
export const UserDataContext = createContext<UserDataContextType | undefined>(
    undefined
);
export function useData() {
    const context = useContext(UserDataContext);
    if (!context)
        throw new Error('useData must be used within a UserDataProvider');
    return context;
}
