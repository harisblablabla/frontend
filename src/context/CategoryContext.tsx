'use client';

import React, { createContext, useState, useContext, ReactNode, Dispatch, SetStateAction, useEffect, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getCategories } from '@/lib/api';
import type { Category } from '@/types';

interface CategoryContextType {
    categories: Category[];
    setCategories: Dispatch<SetStateAction<Category[]>>;
    selectedCategoryId: string | null;
    selectCategory: (categoryId: string | null) => void
    selectedCategoryName: string | undefined;
    isLoadingCategories: boolean;
    categoriesError: string | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(() => {
        return searchParams.get('category')
    });
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    //fetch initial categories
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
    
    //update selectedCategoryId while change the category
    useEffect(() => {
        setSelectedCategoryId(searchParams.get('category'));
    }, [searchParams])

    //return selected category
    const selectedCategoryName = React.useMemo(() => {
        return categories.find(cat => cat.id === selectedCategoryId)?.name;
    }, [categories, selectedCategoryId]);

    //handle category selection AND update URL
    const selectCategory = useCallback((categoryId: string | null) => {
        setSelectedCategoryId(categoryId);

        // Update URL Search Params
        const current = new URLSearchParams(Array.from(searchParams.entries()));

        if (!categoryId) {
            current.delete('category'); // Remove param if null category is selected
        } else {
            current.set('category', categoryId); // Set the new category ID
        }

        // Create the new search string
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);

    }, [searchParams, pathname, router]);

    const value = {
        categories,
        setCategories,
        selectedCategoryId,
        selectCategory,
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

//access a context value from a CategoryContext
export const useCategoryContext = (): CategoryContextType => {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error('useCategoryContext must be used within a CategoryProvider');
    }
    return context;
};
