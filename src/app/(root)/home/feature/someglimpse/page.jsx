import React from "react";
import { getSomeGlimpseData } from "./actions";
import { SomeGlimpseEditor } from "./_components";

export default async function SomeGlimpsePage() {
  const data = await getSomeGlimpseData();
  
  if (!data.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
          <p className="text-red-800">Error loading SomeGlimpse data: {data.error}</p>
        </div>
      </div>
    );
  }

  const someGlimpseData = data.someGlimpse || {};
  const initialData = {
    stories: someGlimpseData.stories || [],
    header: someGlimpseData.header || {
      badgeText: "PROJECT STORIES",
      title: "Some Glimpse",
      description: "Journey through our most impactful projects and see how we transform ideas into digital experiences"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SomeGlimpseEditor initialData={initialData} />
    </div>
  );
}
