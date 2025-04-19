import CategorySidebar from '@/components/CategorySidebar/CategorySidebar'
import React from 'react'

export default function MainAppLayout({
    children
}: { children: React.ReactNode }) {
    return (
        <div>
            <div className="flex min-h-screen">
                {/* Left Column: Category Sidebar */}
                <div className="w-72 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
                    <CategorySidebar />
                </div>

                {/* Right Column: Page Content */}
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>
        </div>
    )
}