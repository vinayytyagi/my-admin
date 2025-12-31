"use client";
import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
// import { motion } from "framer-motion";
import { ScalingSkeleton } from './Skeletons';

const stars = Array(5).fill(Star);

function TestimonialCard() {
  return (
    <div className="p-2 bg-white rounded shadow-sm max-w-sm border border.black/5">
      {/* Star Rating */}
      <div className="flex text-gray-800 mb-3">
        {stars.map((Icon, index) => (
          <Icon key={index} className="w-4 h-4 fill-gray-800" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-gray-800 text-base leading-relaxed mb-4 font-semibold">
        Xenotix transformed our app idea into reality. Their team delivered
        exceptional quality while staying on budget.
      </p>

      {/* Author/Avatar */}
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-200">
          <Image
            src="/tech-logos/serviceman.png"
            alt="Dave C"
            width={34}
            height={34}
            className="object-cover"
          />
        </div>
        <span className="text-sm font-semibold text-gray-800">Dave C</span>
      </div>
    </div>
  );
}

export default function Scaling({
  headingLine1 = "",
  headingLine2 = "",
  subtext = "",
  ctaLabel = "",
  bgImage = "/Images/Bg.jpg",
  fgImage = "/Images/htm1.avif",
  columns,
} = {}) {
  // Show skeleton if no data provided
  const hasCustomBgImage = bgImage && bgImage !== "/Images/Bg.jpg";
  const hasCustomFgImage = fgImage && fgImage !== "/Images/htm1.avif";
  
  if (!headingLine1 && !headingLine2 && !subtext && !ctaLabel && !hasCustomBgImage && !hasCustomFgImage && (columns === undefined || columns === null || (Array.isArray(columns) && columns.length === 0))) {
    return <ScalingSkeleton />;
  }

  // Use actual columns if provided, otherwise empty array (no defaults)
  const columnsList = (columns !== undefined && columns !== null && Array.isArray(columns)) ? columns : [];

  return (
    <section className="bg-[#f7f4f0] px-4 py-16 md:px-8">
      <div
        className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start"
      >
        {/* Left: Heading, subtext, CTA, testimonial */}
        <div className="order-2 md:order-1">
          {(headingLine1 || headingLine2) && (
            <h2 className="text-4xl md:text-6xl font-semibold leading-tight tracking-tight text-black">
              {headingLine1}
              {headingLine2 && <><br />{headingLine2}</>}
            </h2>
          )}
          {subtext && <p className="mt-4 text-gray-600 text-base md:text-lg max-w-xl">{subtext}</p>}

          {ctaLabel && (
            <button
              className="relative mt-6 inline-flex items-center justify-center bg-black text-white px-5 py-3 rounded-full font-medium overflow-hidden group"
            >
              <span className="block">{ctaLabel}</span>
            </button>
          )}

          <div className="mt-7">
            <TestimonialCard />
          </div>
        </div>

        {/* Right: Gradient-backed code panel with layered background */}
        {(bgImage || fgImage) && (
          <div
            className="order-1 md:order-1 lg:order-2 relative w-full aspect-[4/3] md:h-[500px] overflow-hidden rounded-xl"
          >
            {/* Background image */}
            {bgImage && (
              <div className="absolute bottom-[10px] left-[6px] w-full h-full z-0 rounded-lg cursor-pointer overflow-hidden">
                <Image
                  src={bgImage}
                  alt="Background"
                  fill
                  className="object-cover object-center rounded-lg cursor-pointer"
                  priority
                />
              </div>
            )}

            {/* Foreground image */}
            {fgImage && (
              <div className="absolute top-0 right-0 w-[95%] h-[95%] z-10 overflow-hidden rounded-lg">
                <Image
                  src={fgImage}
                  alt="Foreground"
                  fill
                  quality={100}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover scale-110 origin-left-bottom rounded-xl ml-6 pb-6 "
                  priority
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom 3 Columns */}
      {columnsList.length > 0 && (
        <div
          className="bg-[#f7f4f0] py-16 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {columnsList.map((col, idx) => (
              <div key={idx} className="flex flex-col">
                {col.title && <h3 className="text-xl font-semibold text-gray-900 mb-2">{col.title}</h3>}
                {col.desc && <p className="text-gray-600">{col.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

