import React from 'react';
import { Users, CalendarDays, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const BlogCard = ({ blog }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 relative">
      {blog?.hasNewRequest && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
          New
        </div>
      )}
      
      <Link href={`/blogs/edit-blog/${blog?.slug}`}>
        <div className="h-full flex flex-col cursor-pointer">
          <div className="w-full h-36 relative">
            {blog?.imageUrl ? (
              <Image 
                src={blog.imageUrl} 
                alt={blog.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-orange-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <ImageIcon size={32} className="text-orange-300" />
                  <span className="text-xs text-orange-400 mt-1">No image</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="p-5">
            <h3 className="font-semibold text-lg text-gray-800 line-clamp-1 mb-2">{blog.title}</h3>
            
            <div className="space-y-3 flex-grow mb-4">
              <div className="flex items-center text-gray-600">
                <Users size={18} className="mr-2 text-orange-500" />
                <span className="text-sm">{blog.viewCount || 0} views</span>
              </div>
              
              {blog.createdAt && (
                <div className="flex items-center text-gray-600">
                  <CalendarDays size={18} className="mr-2 text-orange-500" />
                  <span className="text-sm">
                    Start: {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">ID: {blog.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                blog.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {blog.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard; 