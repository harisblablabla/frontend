// src/context/CategoryContext.tsx
'use client';

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { getCategories } from '@/lib/api';
import type { Category } from '@/types';  

interface CategoryContextType {
    categories: Category[];
    setCategories: Dispatch<SetStateAction<Category[]>>; 
    selectedCategoryId: string | null;
    setSelectedCategoryId: Dispatch<SetStateAction<string | null>>;
    selectedCategoryName: string | undefined;
    isLoadingCategories: boolean; 
    categoriesError: string | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInitialCategories = async () => {
            setIsLoadingCategories(true);
            setCategoriesError(null);
            try {
                const fetchedCategories = await getCategories(); 
                setCategories(fetchedCategories || []);
            } catch (err) {
                console.error("Failed to fetch initial categories:", err);
                setCategoriesError(err instanceof Error ? err.message : "An unknown error occurred fetching categories.");
                setCategories([]);
            } finally {
                setIsLoadingCategories(false);
            }
        };

        fetchInitialCategories();
    }, []); 

    const selectedCategoryName = React.useMemo(() => {
        return categories.find(cat => cat.id === selectedCategoryId)?.name;
    }, [categories, selectedCategoryId]);

    const value = {
        categories,
        setCategories, // Keep this setter for optimistic updates in Sidebar
        selectedCategoryId,
        setSelectedCategoryId,
        selectedCategoryName,
        isLoadingCategories,
        categoriesError,   
    };

    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
};

export const useCategoryContext = (): CategoryContextType => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;
};