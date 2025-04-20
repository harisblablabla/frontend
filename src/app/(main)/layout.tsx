'use client'
import CategorySidebar from '@/components/CategorySidebar/CategorySidebar'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/16/solid'
import React, { useState } from 'react'

export default function MainAppLayout({
    children
}: { children: React.ReactNode }) {

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false)
    return (
        <div>
            <div className="flex min-h-screen bg-gray-50">
                {/* Left Column: Category Sidebar */}
                <div className="hidden md:block w-72 bg-white flex-shrink-0 border-r border-gray-200 ">
                    <div className="sticky top-0 z-10 flex mx-auto items-center justify-center px-4 py-4 bg-primary">
                        <p className="text-sm text-white text-center font-semibold">Posts</p>
                    </div>
                    <CategorySidebar />
                </div>

                {isMobileMenuOpen && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden'
                        onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                )}

                <div className={`fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <CategorySidebar />
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 md:hidden"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* --- Main Content Area --- */}
                <div className="flex-1 min-w-0 flex flex-col">
                    {/* Mobile Header / Toggle Button Area */}
                    <div className="md:hidden sticky top-0 z-10 flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-primary">
                        {/* Placeholder for Page Title or Logo */}
                        <span className="text-lg font-semibold text-white">Posts</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-1 text-white hover:text-gray-200"
                            aria-label="Open sidebar"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Render the specific page content */}
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}