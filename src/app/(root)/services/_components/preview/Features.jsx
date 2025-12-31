"use client";
import Image from "next/image";
import React from "react";
// import { motion } from "framer-motion";

const Features = ({ heading = "", subheading = "", items } = {}) => {
  // Show skeleton if no data provided
  if (!heading && !subheading && (items === undefined || items === null || (Array.isArray(items) && items.length === 0))) {
    return null;
  }

  // Only use defaults if items is not provided (undefined/null), not if it's an empty array
  const cards = (items !== undefined && items !== null && Array.isArray(items)) ? items : [];

  return (
    <section className="bg-[#f7f4f0] text-black py-20 px-4 md:px-8">
      <div className="container mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-16">
          {heading && <h2 className="mx-auto max-w-[20ch] text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-semibold leading-tight tracking-tight">{heading}</h2>}
          {subheading && <p className="mt-6 md:mt-8 text-base md:text-lg text-gray-600 max-w-3xl mx-auto font-medium">{subheading}</p>}
        </div>

        {/* Cards Grid */}
        {cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-6 mx-2 md:mx-16">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className="group relative overflow-hidden rounded-sm ring-1 ring-black/5 flex flex-col h-auto"
              >
                {/* Top visual area */}
                <div className="relative w-full bg-[#eae6e2] overflow-hidden min-h-[260px] md:min-h-[400px] pt-4">
                  {/* Background image */}
                  {card.backgroundImage && (
                    <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Image
                        src={card.backgroundImage}
                        alt="Background effect"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Foreground image */}
                  {card.frontImage && (
                    <div
                      className="relative z-10 transition-transform duration-500 m-6 md:m-8 group-hover:scale-108 group-hover:-translate-y-2 p-8"
                    >
                      <div className="w-full aspect-[16/9] flex items-center justify-center">
                        <Image
                          src={card.frontImage}
                          alt={card.title}
                          fill
                          className={`object-contain rounded-lg 
                          ${card.id === 2 ? "translate-x-[40%] scale-125" : ""} 
                          ${card.id === 4 ? "translate-y-[20%] scale-133" : ""}`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom content */}
                <div
                  className="w-full bg-white p-4 sm:p-5 md:p-6 text-left flex flex-col"
                >
                  {card.title && <h3 className="text-base sm:text-base md:text-lg font-semibold mb-1 sm:mb-2">{card.title}</h3>}
                  {card.description && <p className="text-gray-600 leading-snug text-sm sm:text-sm md:text-base font-normal">{card.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;

