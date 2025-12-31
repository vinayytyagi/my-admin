"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function MobilePreview({ apps, dataLoading }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide for preview
  useEffect(() => {
    if (apps && apps.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % apps.length);
      }, 4000);
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
    <div className="relative min-h-[600px] flex items-center justify-center">
      {apps && apps.length > 0 ? (
        <div className="relative">
          {/* Phone Frame */}
          <div className="relative w-80 h-[640px] bg-black rounded-[3rem] p-2 shadow-2xl">
            {/* Screen */}
            <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
              
              {/* Screen Content */}
              <div className="relative h-full">
                <div className="relative h-full overflow-hidden rounded-[2.5rem]">
                  <Image
                    src={apps[currentSlide]?.image || "/placeholder.webp"}
                    alt={apps[currentSlide]?.title || "Mobile app"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {apps.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900"
              >
                <ChevronRight size={20} />
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

