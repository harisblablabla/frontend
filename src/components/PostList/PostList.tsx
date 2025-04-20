'use client';

import { getPostByCategories } from '@/lib/api';
import { Category, Post } from '@/types';
import React, { useState, useEffect } from 'react';
import Button from '@/components/Button/Button';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';


interface PostListProps {
  selectedCategoryId: string | null;
  selectedCategoryName?: string;
  categories: Category[]
}

const PostList = ({ selectedCategoryId, selectedCategoryName, categories }: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //If no category is selected, clear posts and don't fetch
    if (!selectedCategoryId) {
      setPosts([]);
      setTotalPosts(0);
      setError(null);
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      setPosts([]);
      setTotalPosts(0);
      console.log(`PostList: Fetching posts for category: ${selectedCategoryId}`);

      try {
        const response = await getPostByCategories(selectedCategoryId);
        setPosts(response);
        setTotalPosts(response.length || 0);
      } catch (err) {
        console.error("PostList: Failed to fetch posts:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching posts.");
        setPosts([]);
        setTotalPosts(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [selectedCategoryId]);

  function formatReadableDate(dateString: string): string {
    const date = new Date(dateString);

    const weekday = date.toLocaleString('en-US', { weekday: 'long' });
    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();
    
    const suffix =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
        ? 'rd'
        : 'th';
  
    return `${weekday}, ${month} ${day}${suffix} ${year}`;
  }
  

  //Initial state or no category selected
  if (!selectedCategoryId && !isLoading && !error) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        <p>Select a category from the sidebar to view posts</p>
      </div>
    );
  }

  //Loading state
  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-5 pb-3"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  //Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md" role="alert">
        <strong className="font-bold">Error loading posts:</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  //Display Post
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      {/* Header showing results count and category - No change needed */}
      <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-300">
        Found {totalPosts} posts
        {selectedCategoryName ? ` of "${selectedCategoryName}"` : ''}
      </h2>

      {/* No Posts Found Message */}
      {posts.length === 0 && !isLoading && (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <p>No posts found for &quot;{selectedCategoryName || 'this category'}&quot;</p>
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
          >
            <p className="text-sm text-gray-500 mb-2">{formatReadableDate(post.date)}</p>
            <p className="text-gray-700 leading-relaxed mb-4">
              {post.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((catId, index) => {
                const isSelected = catId === selectedCategoryId;
                const categoryDetails = categories.find(cat => cat.id === catId)
                return (
                  <Button key={index}
                  variant={isSelected ? 'outline' : 'primary'}
                  size='sm'
                  className='justify-start rounded-sm'
                  endIcon={{
                    icon: categoryDetails?.favorite
                         ? <StarIconSolid className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-white'}`} /> 
                         : <StarIconOutline className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-white'}`} /> 
                  }}
                  >{categoryDetails?.name}</Button>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PostList;