'use client'
import PostList from '@/components/PostList/PostList'
import { useCategoryContext } from '@/context/CategoryContext'
import React from 'react'

const PostsPage = () => {
  const {selectedCategoryId, selectedCategoryName, categories} = useCategoryContext()
  return (
    <div>
        <PostList 
          selectedCategoryId={selectedCategoryId}
          selectedCategoryName={selectedCategoryName}
          categories={categories}
        />
    </div>
  )
}

export default PostsPage