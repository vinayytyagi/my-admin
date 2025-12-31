"use client";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import BlogsHeader from "./_components/BlogHeader";
import BlogsFilters from "./_components/BlogsFilters";
import BlogsList from "./_components/BlogsList";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all"); 

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        if (statusFilter !== "all") {
          queryParams.set("status", statusFilter);
        }

        if (searchQuery.trim()) {
          queryParams.set("title", searchQuery.trim());
        }

        if (sortOption === "oldest") {
          queryParams.set("order", "oldest");
        } else if (sortOption === "alphabetical") {
          queryParams.set("order", "a-z");
        } else {
          queryParams.set("order", "recent");
        }

        const res = await fetch(`/api/blogs/get-blogs?${queryParams.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch blogs");
        }

        const formattedBlogs = data.blogs.map((blog) => {
          let createdAtISO = new Date().toISOString();

          try {
            if (blog.createdAt?.seconds) {
              createdAtISO = new Date(blog.createdAt.seconds * 1000).toISOString();
            } else if (typeof blog.createdAt === "string") {
              createdAtISO = new Date(blog.createdAt).toISOString();
            }
          } catch (error) {
            console.warn("Invalid createdAt value:", blog.createdAt);
          }

          return {
            ...blog,
            createdAt: createdAtISO,
          };
        });

        setBlogs(formattedBlogs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Error fetching blogs: " + error.message);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [searchQuery, statusFilter, sortOption]);

  const filteredBlogs = useMemo(() => blogs, [blogs]);

  return (
    <div className="min-h-screen bg-[#f9fafb] p-6 md:p-8">
      <BlogsHeader blogsCount={blogs.length} />
      <BlogsFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOption={sortOption}
        setSortOption={setSortOption}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <BlogsList blogs={filteredBlogs} loading={loading} />
    </div>
  );
};

export default BlogsPage;
