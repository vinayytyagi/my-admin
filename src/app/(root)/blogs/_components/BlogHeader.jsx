'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const BlogsHeader = ({ blogsCount }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", authUser.uid));
          if (userDoc.exists()) {
            setUser({
              ...authUser,
              ...userDoc.data()
            });
          } else {
            setUser(authUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(authUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUserInitials = () => {
    if (!user) return "U";
    
    if (user.name) {
      const nameParts = user.name.split(" ");
      if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    
    return "U";
  };

  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8'>
      <div>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 flex items-center'>
          Your Blogs 
          <span className='ml-2 bg-orange-100 text-orange-600 text-sm px-2.5 py-0.5 rounded-full font-medium'>{blogsCount}</span>
        </h1>
        <p className='text-sm text-gray-500 mt-1.5'>Add / view blogs for xenotix</p>
      </div>
      <div className='hidden sm:flex items-center gap-2.5 bg-transparent py-2 px-4 rounded-full mt-4 sm:mt-0 hover:shadow-md transition-all cursor-pointer'>
        
      </div>
    </div>
  );
};

export default BlogsHeader; 