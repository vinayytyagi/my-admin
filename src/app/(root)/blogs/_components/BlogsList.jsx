import React from 'react';
import { Loader2, BookX } from 'lucide-react';
import BlogCard from './BlogCard';

const BlogsList = ({ blogs, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
        <p className="mt-4 text-gray-600 text-center">Loading blogs...</p>
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md border border-gray-100 my-6 text-center p-8">
        <div className="bg-orange-50 p-4 rounded-full mb-6">
          <BookX size={64} className="text-orange-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No Blogs Yet</h3>
        <p className="text-gray-600 max-w-md">
          You haven't created any blogs yet. Use the "Create Blog" button above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default BlogsList; 