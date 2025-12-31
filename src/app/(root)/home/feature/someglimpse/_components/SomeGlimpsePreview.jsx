"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import MockupDevicePreview from "./MockupDevicePreview";

export default function SomeGlimpsePreview({ header, stories, previewStory, editingIndex, newStory, activeStory, setActiveStory }) {
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto play for preview
  useEffect(() => {
    if (stories && stories.length > 0 && isAutoPlaying && !previewStory) {
      const interval = setInterval(() => {
        setActiveStory((prev) => (prev + 1) % stories.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [stories?.length, isAutoPlaying, previewStory, setActiveStory]);

  // Show preview of story being edited, or current active story
  const currentPreviewStory = previewStory || (stories && stories[activeStory]);

  return (
    <div className="space-y-8">
      {/* Header Preview */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-4 border border-gray-200">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
          <span className="text-gray-700 text-xs font-medium">{header?.badgeText || "PROJECT STORIES"}</span>
        </div>
        <h2 className="text-4xl font-bold mb-4">{header?.title || "Some Glimpse"}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{header?.description || "Journey through our most impactful projects"}</p>
      </div>

      {/* Stories Preview */}
      {(stories && stories.length > 0) || currentPreviewStory ? (
        <>
          {/* Story Navigation */}
          {stories && stories.length > 0 && !previewStory && (
            <div className="flex justify-center">
              <div className="flex flex-wrap gap-2 bg-white rounded-2xl p-2 border border-gray-200 shadow-xl">
                {stories.map((story, index) => (
                  <button
                    key={story.id || index}
                    onClick={() => setActiveStory(index)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeStory === index
                        ? `${story.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
                            story.color === 'green' ? 'bg-gradient-to-r from-green-500 to-teal-500' :
                            story.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                            'bg-gradient-to-r from-orange-500 to-red-500'
                          } text-white shadow-lg`
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {story.name || story.title?.split(' ')[0] || `Story ${index + 1}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preview Story Display */}
          {currentPreviewStory && (
            <div className="space-y-4">
              {(editingIndex !== null || newStory?.id) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800 font-medium">📝 Preview Mode - Editing Story</p>
                </div>
              )}
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                {/* Story Content */}
                <div className="space-y-6">
                  <div>
                    <div className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium mb-3 ${
                      currentPreviewStory.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      currentPreviewStory.color === 'green' ? 'bg-green-100 text-green-700' :
                      currentPreviewStory.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {currentPreviewStory.subtitle || "Subtitle"}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">{currentPreviewStory.title || "Story Title"}</h3>
                    <p className="text-lg text-gray-600">{currentPreviewStory.description || "Story description will appear here..."}</p>
                  </div>
                  {currentPreviewStory.stats && currentPreviewStory.stats.length > 0 && currentPreviewStory.stats.some(s => s.label || s.value) && (
                    <div className="flex flex-wrap gap-6">
                      {currentPreviewStory.stats.filter(s => s.label || s.value).map((stat, index) => (
                        <div key={index}>
                          <div className={`text-2xl font-bold ${
                            currentPreviewStory.color === 'blue' ? 'text-blue-600' :
                            currentPreviewStory.color === 'green' ? 'text-green-600' :
                            currentPreviewStory.color === 'purple' ? 'text-purple-600' :
                            'text-orange-600'
                          }`}>
                            {stat.label || "0%"}
                          </div>
                          <div className="text-sm text-gray-600">{stat.value || "Stat Description"}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {currentPreviewStory.features && currentPreviewStory.features.length > 0 && currentPreviewStory.features.some(f => f) && (
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-3">Key Features</h4>
                      <div className="space-y-2">
                        {currentPreviewStory.features.filter(f => f).map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              currentPreviewStory.color === 'blue' ? 'bg-blue-500' :
                              currentPreviewStory.color === 'green' ? 'bg-green-500' :
                              currentPreviewStory.color === 'purple' ? 'bg-purple-500' :
                              'bg-orange-500'
                            }`} />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mockup Preview */}
                <div className="flex justify-center">
                  <MockupDevicePreview
                    type={currentPreviewStory.mockupType || "mobile"}
                    gradient={currentPreviewStory.gradient || "from-blue-500 via-purple-500 to-pink-500"}
                    title={currentPreviewStory.title || "App Title"}
                    features={currentPreviewStory.features?.filter(f => f) || []}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">No stories added yet</p>
          <p className="text-sm text-gray-500">Add stories in the editor to see preview</p>
        </div>
      )}
    </div>
  );
}

