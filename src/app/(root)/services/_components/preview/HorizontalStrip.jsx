"use client";
import Image from "next/image";
import React from "react";
import { HorizontalStripSkeleton } from './Skeletons';

const Items = ({ texts = [], bgImage = "/Images/Bg.jpg", overlayImage = "/Images/image 1.svg" }) => (
  <div className="flex items-center gap-6 md:gap-10 lg:gap-16 whitespace-nowrap shrink-0">
    {texts.slice(0, 2).map((t, i) => (
      <h2 key={`t1-${i}`} className="text-xl md:text-2xl lg:text-5xl font-semibold ml-8">{t}</h2>
    ))}
    <div className="relative h-8 w-8 md:h-16 md:w-20 rounded-lg overflow-hidden shrink-0">
      {bgImage && <Image src={bgImage} alt="chip" fill className="object-cover" />}
      {overlayImage && <Image src={overlayImage} alt="overlay" fill sizes="(max-width: 768px) 2rem, 5rem" className="absolute object-contain " />}
    </div>
  </div>
);

function HorizontalStrip({ texts = [], bgImage, overlayImage }) {
  // Show skeleton if no data provided
  if ((!texts || !Array.isArray(texts) || texts.length === 0) && !bgImage && !overlayImage) {
    return <HorizontalStripSkeleton />;
  }

  return (
    <section className="bg-black text-white py-6 px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="overflow-hidden">
          <div
            className="flex gap-6 marquee-row cursor-pointer"
            style={{ width: "fit-content" }}
          >
            {/* Duplicate Items for seamless loop */}
            <Items texts={texts} bgImage={bgImage || "/Images/Bg.jpg"} overlayImage={overlayImage} />
            <Items texts={texts} bgImage={bgImage || "/Images/Bg.jpg"} overlayImage={overlayImage} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HorizontalStrip;

