"use client";
import React, { useEffect, useMemo, useState } from "react";

const defaultHeader = {
  badgeText: "BLOG UNIVERSE",
  title: "Insights & Stories",
  description:
    "Dive into our collection of thoughts, tutorials, and insights from the world of design and development",
};

export default function BlogsPreview({ items = [], header }) {
  const resolvedHeader = { ...defaultHeader, ...(header || {}) };
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const featuredBlogs = useMemo(() => {
    const flagged = items.filter((b) => b.featured);
    if (flagged.length > 0) return flagged;
    return items.slice(0, Math.min(3, items.length));
  }, [items]);

  useEffect(() => {
    if (featuredBlogs.length === 0) return;
    if (currentFeaturedIndex >= featuredBlogs.length) {
      setCurrentFeaturedIndex(0);
      return;
    }
    const t = setInterval(() => {
      setCurrentFeaturedIndex((prev) =>
        prev === featuredBlogs.length - 1 ? 0 : prev + 1
      );
    }, 6000);
    return () => clearInterval(t);
  }, [featuredBlogs, currentFeaturedIndex]);

  useEffect(() => {
    setCurrentFeaturedIndex(0);
  }, [items.length]);

  const currentFeatured =
    featuredBlogs[featuredBlogs.length ? currentFeaturedIndex : 0];

  return (
    <section className="relative overflow-hidden">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm rounded-full px-4 py-2 mb-4 border border-gray-200 dark:border-gray-700">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse" />
          <span className="text-gray-700 dark:text-gray-300 text-xs font-medium">
            {resolvedHeader.badgeText}
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          {resolvedHeader.title}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {resolvedHeader.description}
        </p>
      </div>

      {currentFeatured && (
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-400 rounded-full" />
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <span className="hidden sm:inline">📖 Reader Mode • </span>blog.company.com
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div
                  className={`w-full h-56 bg-gradient-to-br ${
                    currentFeatured.gradient ||
                    "from-purple-500 via-pink-500 to-red-500"
                  } rounded-xl mb-6 flex items-center justify-center`}
                >
                  <div className="text-white text-5xl font-bold opacity-20">
                    {currentFeatured.category || "Blog"}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                    <span>{currentFeatured.author || "Author"}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{currentFeatured.date || "Date"}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{currentFeatured.readTime || "Read time"}</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                    {currentFeatured.title || "Title"}
                  </h3>
                  <p className="text-sm lg:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {currentFeatured.excerpt || "Excerpt..."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-3 text-sm">
                    Article Stats
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Views</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {currentFeatured.views || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Read Time</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {currentFeatured.readTime || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Category</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {currentFeatured.category || "—"}
                      </span>
                    </div>
                  </div>
                </div>
                {!!(currentFeatured.tags || []).length && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-gray-900 dark:text-gray-100 font-semibold mb-3 text-sm">
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(currentFeatured.tags || []).map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              {featuredBlogs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFeaturedIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentFeaturedIndex
                      ? "bg-purple-500 scale-125"
                      : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


