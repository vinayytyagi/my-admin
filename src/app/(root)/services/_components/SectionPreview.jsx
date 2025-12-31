"use client";
import React from 'react';
import Hero from './preview/Hero';
import Features from './preview/Features';
import DataSection from './preview/DataSection';
import HorizontalStrip from './preview/HorizontalStrip';
import Scaling from './preview/Scaling';
import CustomerTestimonials from './preview/CustomerTestimonials';

const SectionPreview = ({ sections = [] }) => {
  const visibleSections = sections
    .filter((s) => s && s.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const renderSection = (section) => {
    if (!section || !section.type) return null;
    const { type, props = {} } = section;

    switch (type) {
      case 'hero':
        return <Hero key={section.id} {...props} />;
      case 'features':
        return <Features key={section.id} {...props} />;
      case 'dataSection':
        return <DataSection key={section.id} {...props} />;
      case 'horizontalStrip':
        return <HorizontalStrip key={section.id} {...props} />;
      case 'scaling':
        return <Scaling key={section.id} {...props} />;
      case 'customerTestimonials':
        return <CustomerTestimonials key={section.id} {...props} />;
      default:
        return (
          <section key={section.id} className="bg-gray-50 py-4 px-4 border-b">
            <div className="text-sm text-gray-500">Unknown section type: {type}</div>
          </section>
        );
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {visibleSections.length > 0 ? (
        visibleSections.map(renderSection)
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <p>No sections yet. Add sections in the right sidebar.</p>
        </div>
      )}
    </div>
  );
};

export default SectionPreview;

