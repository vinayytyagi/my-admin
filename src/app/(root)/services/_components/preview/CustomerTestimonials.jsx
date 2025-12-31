"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { motion } from 'framer-motion';
import { CustomerTestimonialsSkeleton } from './Skeletons';

const CustomerTestimonials = ({
  headerTitle = "",
  ctaLabel = "",
  testimonials,
  faqs,
  backgroundImage,
} = {}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(2);

  // Show skeleton if no data provided
  if (!headerTitle && !ctaLabel && (testimonials === undefined || testimonials === null || (Array.isArray(testimonials) && testimonials.length === 0))) {
    return <CustomerTestimonialsSkeleton />;
  }

  // Use actual testimonials/faqs if provided, otherwise empty arrays (no defaults)
  const list = (testimonials !== undefined && testimonials !== null && Array.isArray(testimonials)) ? testimonials : [];
  const faqList = (faqs !== undefined && faqs !== null && Array.isArray(faqs)) ? faqs : [];

  useEffect(() => {
    const updateCards = () => setCardsPerView(window.innerWidth < 768 ? 1 : 2);
    updateCards();
    window.addEventListener('resize', updateCards);
    return () => window.removeEventListener('resize', updateCards);
  }, []);

  // Show skeleton if no data provided
  if (!headerTitle && !ctaLabel && list.length === 0) {
    return <CustomerTestimonialsSkeleton />;
  }

  const maxIndex = list.length - cardsPerView;
  const handlePrev = () => setCurrentIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentIndex(prev => Math.min(maxIndex, prev + 1));

  return (
    <div className="container mx-auto px-2 md:px-4 lg:px-4 py-12 bg-white">
      {(headerTitle || ctaLabel) && (
        <div className="mb-12 text-left">
          {headerTitle && <h1 className="text-5xl font-semibold text-gray-900 mb-6">{headerTitle}</h1>}
          {ctaLabel && (
            <button className="relative bg-black text-white px-6 py-3 rounded-full text-sm font-medium overflow-hidden group transition-colors hover:bg-gray-800">
              <span className="block">{ctaLabel}</span>
            </button>
          )}
        </div>
      )}

      {/* Testimonials Slider */}
      {list.length > 0 && (
        <div className="relative overflow-hidden">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * (cardsPerView === 1 ? 100 : 50)}%)` }}
          >
            {list.map((testimonial, index) => (
              <div
                key={testimonial.id || index}
                className="flex-shrink-0 w-full md:w-1/2 px-0"
              >
                <div className="relative h-[600px] sm:h-[460px] md:h-[430px] lg:h-[440px] rounded-2xl overflow-hidden shadow-lg">
                  {backgroundImage && (
                    <img
                      src={backgroundImage}
                      alt="background"
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: 'left bottom' }}
                    />
                  )}
                  <div className="relative z-10 h-full p-3 sm:p-4">
                    <div className="h-full flex flex-col gap-3 md:grid md:grid-cols-2">
                      <div className="flex-shrink-0 h-[400px] sm:h-[350px] md:col-span-1 md:h-full rounded-xl overflow-hidden bg-white/10 backdrop-blur-[1px] md:min-h-[300px]">
                        <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover object-center" />
                      </div>
                      <div className="flex-1 flex flex-col gap-3 md:col-span-1">
                        <div className="bg-white rounded-xl shadow border p-3 sm:p-4 md:p-5 flex-1 flex items-center md:min-h-[190px]">
                          <blockquote className="text-gray-900 text-sm sm:text-[15px] md:text-base leading-relaxed font-semibold">
                            {`"${testimonial.quote}"`}
                          </blockquote>
                        </div>
                        <div className="bg-white rounded-xl shadow border p-3 sm:p-4">
                          <h4 className="font-semibold text-gray-900 text-[13px] sm:text-base">{testimonial.name}</h4>
                          <p className="text-gray-600 text-xs sm:text-sm leading-snug">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arrows */}
      {list.length > 0 && (
        <div className="flex gap-3 mt-6 justify-center md:justify-start">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center transition-all ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 hover:bg-gray-50'}`}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            disabled={currentIndex >= maxIndex}
            onClick={handleNext}
            className={`w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center transition-all ${currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400 hover:bg-gray-50'}`}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      )}

      {/* FAQ Section */}
      {faqList.length > 0 && (
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2">
          {faqList.map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-5 md:p-6">
              {f.q && <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">{f.q}</h3>}
              {f.a && <p className="text-sm md:text-base text-gray-600 leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerTestimonials;

