import React from "react";
import { getHomepageBlogs } from "./actions";
import { BlogsEditor } from "./_components";

export default async function HomepageBlogsPage() {
  const data = await getHomepageBlogs();
  if (!data.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
          <p className="text-red-800">Error loading homepage blogs: {data.error}</p>
        </div>
      </div>
    );
  }
  const initialItems = data.blogs?.items || [];
  const initialSelection = data.blogs?.recent || [];
  const initialHeader = data.blogs?.header || undefined;
  return (
    <div className="min-h-screen bg-gray-50">
      <BlogsEditor
        initialItems={initialItems}
        initialSelection={initialSelection}
        initialHeader={initialHeader}
      />
    </div>
  );
}


