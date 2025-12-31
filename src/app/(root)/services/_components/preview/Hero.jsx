"use client";
import { Star } from 'lucide-react';
import Image from 'next/image';
// import { motion } from 'framer-motion';
import { HeroSkeleton } from './Skeletons';

const Hero = ({
  headline = "",
  subheadline = "",
  ctaLabel = "",
  leftBadgeText = "",
  topLeftImage = "",
  bottomBgImage = "",
  statTitle = "",
  statSubtitle = "",
  statNote = "",
  reviewSource = "",
  reviewCount = "",
  bottomOverlayText = "",
} = {}) => {
  // Show skeleton if no data provided
  if (!headline && !subheadline && !leftBadgeText && !topLeftImage && !statTitle) {
    return <HeroSkeleton />;
  }

  return (
    <section className="bg-white text-black py-20 px-2 md:px-4 lg:px-4 ">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10 ">
        
        {/* Left Side Content */}
        <div
          className="flex-1 max-w-2xl text-center md:text-left "
        >
          {leftBadgeText && <p className="text-sm text-gray-600 mb-2 font-semibold">{leftBadgeText}</p>}
          {headline && <h1 className="text-4xl md:text-6xl font-semibold leading-tight mb-4">{headline}</h1>}
          {subheadline && <p className="text text-gray-800 mb-8 font-semibold">{subheadline}</p>}
          {ctaLabel && (
            <button className="relative bg-black text-white px-6 py-3 rounded-full text-sm font-medium overflow-hidden group transition-all duration-300 focus:outline-none focus:ring-0 active:outline-none">
              <span className="block">{ctaLabel}</span>
            </button>
          )}

          {(reviewSource || reviewCount) && (
            <div className="flex items-center justify-center md:justify-start mt-4">
              {reviewSource && <p className="mr-2 text-gray-500">{reviewSource}</p>}
              <div className="flex text-gray-500 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              {reviewCount && <span className="text-sm text-gray-500">{reviewCount}</span>}
            </div>
          )}
        </div>

        {/* Right Side Cards */}
        <div
          className="flex-1 grid gap-2 w-full max-w-xl"
        >
          {/* Top Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-full">
            {/* Image Card */}
            {topLeftImage && (
              <div
                className="relative w-full pb-[100%] rounded-lg overflow-hidden"
              >
                <Image
                  src={topLeftImage}
                  alt="Preview"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            )}

            {/* Black Text Card */}
            {(statTitle || statSubtitle || statNote) && (
              <div
                className="relative rounded-lg bg-black text-white p-4 sm:p-6 md:p-8 flex flex-col justify-between h-auto sm:h-72 md:h-96"
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-snug antialiased">
                  {statTitle}
                  {statSubtitle && <span className="block text-gray-400 text-sm sm:text-base md:text-lg">{statSubtitle}</span>}
                </h2>
                {statNote && (
                  <p className="text-xs sm:text-sm md:text-base text-gray-400 mt-2 sm:mt-4 font-semibold">
                    {statNote}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Row */}
          {bottomBgImage && (
            <div
              className="relative rounded-lg h-36 w-full overflow-hidden"
            >
              <Image
                src={bottomBgImage}
                alt="Background"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover cursor-pointer"
              />
              {bottomOverlayText && (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="flex items-center gap-2 bg-[#2b2524]/90 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl shadow-lg backdrop-blur-sm border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 opacity-90" fill="currentColor">
                      <path d="M3 3h2v18H3zM7 7h2v14H7zM11 11h2v10h-2zM15 5h2v16h-2zM19 9h2v12h-2z"/>
                    </svg>
                    <span className="text-sm sm:text-base font-semibold whitespace-nowrap">
                      {bottomOverlayText}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;

