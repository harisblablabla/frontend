// src/components/CategorySidebar/CategorySidebar.tsx
import React from 'react';

const CategorySidebar = () => {
  return (
    // Use semantic <aside> and add padding
    // The border was moved to the wrapper div in page.tsx for this example
    // Add overflow-y-auto if content might exceed height
    <aside className="p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <p className="text-sm text-gray-500">(Category list will go here)</p>
      {/* Placeholder for future category items */}
      <div className="mt-4 space-y-2">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6"></div>
      </div>
    </aside>
  );
}

export default CategorySidebar