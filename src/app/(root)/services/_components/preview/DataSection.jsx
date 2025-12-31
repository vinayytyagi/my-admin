import Image from 'next/image';
import React from 'react';
import { DataSectionSkeleton } from './Skeletons';

const DataSection = ({
  titleLine1 = "",
  titleLine2 = "",
  metricValue = "",
  metricLabel = "",
  imageSrc = "",
  brands,
} = {}) => {
  // Show skeleton if no data provided
  if (!titleLine1 && !titleLine2 && !metricValue && !metricLabel && !imageSrc && (brands === undefined || brands === null || (Array.isArray(brands) && brands.length === 0))) {
    return <DataSectionSkeleton />;
  }

  // Use actual brands if provided, otherwise empty array (no defaults)
  const cards = (brands !== undefined && brands !== null && Array.isArray(brands)) ? brands : [];

  return (
    <section className="bg-white text-black py-20 px-4 md:px-8">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* Left Side: Text and Card */}
        <div className="flex flex-col space-y-6">
          {(titleLine1 || titleLine2) && (
            <h2 className="leading-tight tracking-tight">
              {titleLine1 && <span className="block text-3xl md:text-4xl lg:text-[40px] font-semibold text.black">{titleLine1}</span>}
              {titleLine2 && <span className="block text-3xl md:text-4xl lg:text-[38px] font-semibold text-gray-400">{titleLine2}</span>}
            </h2>
          )}

          {(metricValue || metricLabel) && (
            <div className="mt-8 md:mt-10 flex w-full max-w-xl items-stretch ">
            <div className="flex-shrink-0 w-20 md:w-24 rounded-l-md bg-gradient-to-br from-orange-500 via-red-600 to-purple-700 flex flex-col items-center justify-center gap-2">
                <img
                  src="/tech-logos/ai.webp"
                  alt="Xenotix"
                  className="w-6 h-6 md:w-8 md:h-8"
                />
              </div>

              <div className="flex-1 bg-[#f3f2f1] rounded-r-md px-5 py-4 md:px-6 md:py-5 shadow-sm ml-2">
                {metricValue && <p className="text-4xl md:text-5xl font-semibold text-black">{metricValue}</p>}
                {metricLabel && <p className="mt-1 text-sm md:text-base text-gray-700 font-medium">{metricLabel}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Image */}
        {imageSrc && (
          <div className="mt-8 lg:mt-0 w-full">
            <Image
              src={imageSrc}
              alt="Preview"
              width={1000}
              height={700}
              className="rounded-md shadow-lg w-full h-auto"
              priority={false}
            />
          </div>
        )}
      </div>

      {/* Social proof / brands - Centered below */}
      {cards.length > 0 && (
        <div className="mt-20 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">
            Clients trust Xenotix.
          </h3>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Over 500+ businesses across India rely on Xenotix for their digital transformation.
          </p>

          <div className="mt-8">
            {/* Mobile / tablet: horizontal marquee constrained to viewport */}
            <div className="relative w-full overflow-hidden lg:hidden">
              {/* edge fades */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-[#f7f4f0] to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-[#f7f4f0] to-transparent" />

              {/* scrolling track */}
              <div className="marquee-row flex gap-4 min-w-max">
                {[...cards, ...cards.slice(0, 2)].map((card, idx) => (
                  <div key={idx} className="flex-shrink-0 relative bg-[#f6f3ef] rounded-sm h-50 md:h-60 w-48 md:w-60 flex items-center justify-center shadow-sm overflow-hidden group">
                    <span
                      className={`text-gray-500 text-lg md:text-xl font-semibold group-hover:text-black transition-colors duration-500 ${card.tracking || ""} ${card.bold ? "font-extrabold leading-tight text-center" : ""}`}
                      dangerouslySetInnerHTML={{ __html: card.name }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Large screens: 4x2 grid */}
            <div className="hidden lg:grid grid-cols-4 gap-4 max-w-5xl mx-auto">
              {cards.map((card, idx) => (
                <div key={idx} className="relative bg-[#f6f3ef] rounded-sm h-24 md:h-60 flex items-center justify-center shadow-sm overflow-hidden group">
                  <span
                    className={`text-gray-500 text-lg md:text-xl font-semibold group-hover:text-black transition-colors duration-700 ${card.tracking || ""} ${card.bold ? "font-extrabold leading-tight text-center" : ""}`}
                    dangerouslySetInnerHTML={{ __html: card.name }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DataSection;

