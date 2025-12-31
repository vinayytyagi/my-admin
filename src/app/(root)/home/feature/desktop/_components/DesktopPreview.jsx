"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function DesktopPreview({ apps, dataLoading }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide for preview
  useEffect(() => {
    if (apps && apps.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % apps.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [apps?.length]);

  const nextSlide = () => {
    if (apps && apps.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % apps.length);
    }
  };

  const prevSlide = () => {
    if (apps && apps.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + apps.length) % apps.length);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[700px] flex items-center justify-center">
      {apps && apps.length > 0 ? (
        <div className="relative">
          {/* Browser Window */}
          <div className="relative w-[900px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Browser Header */}
            <div className="h-12 bg-gray-100 border-b border-gray-200 flex items-center px-6 gap-4">
              {/* Traffic Lights */}
              <div className="flex gap-2">
                <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
              
              {/* Address Bar */}
              <div className="flex-1 bg-white rounded-lg px-4 py-2 text-sm text-gray-500 border border-gray-200">
                https://xenotiixtech.design/{apps[currentSlide]?.title?.toLowerCase().replace(/\s+/g, '-') || 'project'}
              </div>
              
              {/* Browser Controls */}
              <div className="flex gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Screen Content */}
            <div className="relative h-[548px]">
              <div className="relative h-full overflow-hidden">
                <Image
                  src={apps[currentSlide]?.image || "/placeholder.webp"}
                  alt={apps[currentSlide]?.title || "Desktop app"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {apps.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-8 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-gray-900 border border-white/50"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-8 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/90 backdrop-blur-sm rounded-full shadow-xl flex items-center justify-center text-gray-600 hover:text-gray-900 border border-white/50"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Slide Indicator */}
          {apps.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {apps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-400 mb-4">No apps added yet</p>
          <p className="text-sm text-gray-500">Add apps in the editor to see preview</p>
        </div>
      )}
    </div>
  );
}

