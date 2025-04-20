'use client';

import React, { useState, useEffect } from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { getCategories, updateNewCategory } from '@/lib/api';
import type { Category } from '@/types';
import Button from '@/components/Button/Button';

export default function CategorySidebar() {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    // State for data, loading, and error handling
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedCategories = await getCategories();
                setCategories(fetchedCategories);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                console.error("Failed to fetch categories:", err);
                setError(err.message || "Could not load categories. Please try again later.");
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);


    const handleTab = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActiveTab(e.target.value)
    }

    // Filter categories based on the active tab and fetched data
    const displayedCategories = categories.filter(category => {
        if (activeTab === 'favorite') {
            return category.favorite;
        }
        return true; // Show all for 'all' tab
    });

    const handleSelectCategory = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        console.log("Selected Category:", categoryId);
    };

    const handleToggleFavorite = async (event: React.MouseEvent, categoryId: string) => {
        event.stopPropagation(); // Prevent category selection
        setError(null)
        
        const categoryToUpdate = categories.find(cat => cat.id === categoryId)

        setCategories(prevCategories =>
            prevCategories.map(cat =>
                cat.id === categoryId ? { ...cat, favorite: !cat.favorite } : cat
            )
        );

        const updatedFavorite = !categoryToUpdate?.favorite

        try {
            const updatePayload = {
                id: categoryToUpdate?.id ?? '',
                name: categoryToUpdate?.name ?? '',
                favorite: updatedFavorite
            }

            const response = await updateNewCategory(categoryToUpdate?.id ?? '', updatePayload)
            console.log("Successfully updated favorite status on backend: ", response);

        } catch (error) {
            console.error("Failed to update favorite status on backend: ", error);
            setError(`Failed to update favorite status for ${categoryToUpdate?.name}. Please try again.`); 
        }
    };

    // --- UI Rendering ---

    const renderContent = () => {
        if (isLoading) {
            // Loading State (Skeleton)
            return (
                <div className="flex-1 space-y-1 overflow-y-auto pr-1 animate-pulse">
                    {[...Array(6)].map((_, i) => ( // Render 7 skeleton loaders
                        <div key={i} className="h-9 bg-gray-200 rounded-md"></div>
                    ))}
                </div>
            );
        }

        if (error) {
            // Error State
            return (
                <div className="flex-1 px-2 py-4 text-red-600 text-sm">
                    <p>Error: {error}</p>
                </div>
            );
        }

        // Data Loaded Successfully State
        return (
            <nav className="flex-1 space-y-3 overflow-y-auto pr-1">
                {displayedCategories.map((category) => {
                    const isSelected = category.id === selectedCategoryId;
                    return (
                        <Button key={category.id} variant={isSelected ? 'outline' : 'primary'}
                            size='sm' onClick={() => handleSelectCategory(category.id)} 
                            endIcon={{
                                icon: category.favorite ? 
                                <StarIconSolid className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-white'}`} /> 
                                : <StarIconOutline className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-white'}`} />,
                                onClick: (e) => handleToggleFavorite(e, category.id),
                            }}>
                            {category.name}
                        </Button>
                    );
                })}

                {displayedCategories.length === 0 && !isLoading && ( // show when the data is empty
                    <p className="text-sm text-gray-500 px-2 py-4">
                        {activeTab === 'favorites' ? 'No favorite categories marked yet.' : 'No categories found.'}
                    </p>
                )}
            </nav>
        );
    };
    
    return (
        <aside className="flex flex-col h-full p-4 bg-white text-gray-900">
            {/* Tabs (Styled like the design, function like radio buttons) */}
            <div className="flex border-b border-gray-200 mb-4 flex-shrink-0">
                <div className="flex flex-row text-xs mx-auto gap-2 py-4">
                    <label className="inline-flex items-center">
                        <input disabled={isLoading} type="radio" className="accent-[var(--primary)]" name="option" value="all" onChange={handleTab} />
                        <span className="ml-2">All categories</span>
                    </label>

                    <label className="inline-flex items-center">
                        <input disabled={isLoading} type="radio" className="accent-[var(--primary)]" name="option" value="favorite" onChange={(handleTab)} />
                        <span className="ml-2">Favorite categories</span>
                    </label>
                </div>
            </div>

            {/* Render Loading, Error, or Category List */}
            {renderContent()}

        </aside>
    );
}