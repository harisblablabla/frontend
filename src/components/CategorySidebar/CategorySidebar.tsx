'use client';

import React, { useState } from 'react';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { updateNewCategory } from '@/lib/api';
import Button from '@/components/Button/Button';
import { useCategoryContext } from '@/context/CategoryContext'; 

export default function CategorySidebar() { 
    const {
        categories,
        setCategories,
        selectedCategoryId,
        setSelectedCategoryId,
        isLoadingCategories,
        categoriesError, 
    } = useCategoryContext();

    const [activeTab, setActiveTab] = useState<string>('all');

    const handleTab = (e: React.ChangeEvent<HTMLInputElement>) => {
        setActiveTab(e.target.value);
    }

    // Define the missing handler
    const handleSelectCategory = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
    };

    const displayedCategories = categories.filter(category => {
        if (activeTab === 'favorite') {
            return category.favorite;
        }
        return true; // Show all for 'all' tab
    });

    const handleToggleFavorite = async (event: React.MouseEvent, categoryId: string) => {
        event.stopPropagation(); // Prevent category selection

        const categoryToUpdate = categories.find(cat => cat.id === categoryId);
        if (!categoryToUpdate) return;

        const newFavoriteStatus = !categoryToUpdate.favorite;

        setCategories(prevCategories =>
            prevCategories.map(cat =>
                cat.id === categoryId ? { ...cat, favorite: newFavoriteStatus } : cat
            )
        );

        try {
            const updatePayload = {
                id: categoryToUpdate.id,
                name: categoryToUpdate.name,
                favorite: newFavoriteStatus
            };

            const response = await updateNewCategory(categoryId, updatePayload);
            console.log("Successfully updated favorite status on backend: ", response);

        } catch (error) {
            console.error("Failed to update favorite status on backend: ", error);
        }
    };

    // --- UI Rendering ---
    const renderContent = () => {
        // Use loading state from context
        if (isLoadingCategories) {
            return (
                <div className="flex-1 space-y-3 overflow-y-auto pr-1 animate-pulse">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-9 bg-gray-200 rounded-md"></div>
                    ))}
                </div>
            );
        }

        // Use error state from context
        if (categoriesError) {
            return (
                <div className="flex-1 px-2 py-4 text-red-600 text-sm">
                    <p>Error loading categories: {categoriesError}</p>
                </div>
            );
        }

        // Data Loaded Successfully
        return (
            <nav className="flex-1 space-y-2 overflow-y-auto pr-1 pt-1">
                {displayedCategories.map((category) => {
                    const isSelected = category.id === selectedCategoryId;
                    return (
                        <Button
                            key={category.id}
                            variant={isSelected ? 'outline' : 'primary'}
                            size='sm'
                            onClick={() => handleSelectCategory(category.id)}
                            className="justify-start rounded-sm"
                            endIcon={{
                                icon: category.favorite
                                     ? <StarIconSolid className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-white'}`} /> 
                                     : <StarIconOutline className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-white'}`} />, 
                                onClick: (e) => handleToggleFavorite(e, category.id),
                            }}
                        >
                            <span className="truncate">{category.name}</span>
                        </Button>
                    );
                })}

                {displayedCategories.length === 0 && !isLoadingCategories && (
                    <p className="text-sm text-gray-500 px-2 py-4">
                        {activeTab === 'favorite' ? 'No favorite categories marked yet.' : 'No categories found.'}
                    </p>
                )}
            </nav>
        );
    };

    return (
        <aside className="flex flex-col h-full p-4 bg-white text-gray-900">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-3 flex-shrink-0">
                <div className="flex flex-row text-xs mx-auto gap-4 py-2">
                    <label className="inline-flex items-center cursor-pointer">
                        <input disabled={isLoadingCategories || !!categoriesError} type="radio" className="accent-[var(--primary)]"
                            name="categoryTab" value="all" onChange={handleTab} defaultChecked
                        />
                        <span className={`ml-2 ${isLoadingCategories || !!categoriesError ? 'text-gray-400' : ''}`}>All categories</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer">
                        <input disabled={isLoadingCategories || !!categoriesError} type="radio" className="accent-[var(--primary)]"
                            name="categoryTab" value="favorite" onChange={handleTab}
                        />
                        <span className={`ml-2 ${isLoadingCategories || !!categoriesError ? 'text-gray-400' : ''}`}>Favorite categories</span>
                    </label>
                </div>
            </div>

            {renderContent()}

        </aside>
    );
}