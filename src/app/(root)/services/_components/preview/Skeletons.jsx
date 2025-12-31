"use client";
import React from 'react';

export const HeroSkeleton = () => (
  <section className="bg-white text-black py-20 px-2 md:px-4 lg:px-4 animate-pulse">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="flex-1 max-w-2xl space-y-4">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-12 w-full bg-gray-200 rounded"></div>
        <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-8 bg-gray-200 rounded"></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>)}
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="flex-1 grid grid-cols-2 gap-2 max-w-xl">
        <div className="pb-[100%] bg-gray-200 rounded-lg"></div>
        <div className="h-96 bg-gray-800 rounded-lg"></div>
        <div className="col-span-2 h-36 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </section>
);

export const FeaturesSkeleton = () => (
  <section className="bg-[#f7f4f0] text-black py-20 px-4 md:px-8 animate-pulse">
    <div className="container mx-auto">
      <div className="text-center mb-16 space-y-4">
        <div className="h-12 w-3/4 mx-auto bg-gray-200 rounded"></div>
        <div className="h-6 w-1/2 mx-auto bg-gray-200 rounded"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mx-2 md:mx-16">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-sm ring-1 ring-black/5">
            <div className="h-64 md:h-96 bg-gray-200"></div>
            <div className="bg-white p-6 space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const DataSectionSkeleton = () => (
  <section className="bg-white text-black py-20 px-4 md:px-8 animate-pulse">
    <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="space-y-6">
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
        <div className="space-y-2">
          <div className="h-10 w-full bg-gray-200 rounded"></div>
          <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-stretch">
          <div className="w-20 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-l-md"></div>
          <div className="flex-1 bg-gray-100 rounded-r-md p-6 space-y-2">
            <div className="h-12 w-24 bg-gray-200 rounded"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="h-96 bg-gray-200 rounded-md"></div>
    </div>
  </section>
);

export const HorizontalStripSkeleton = () => (
  <section className="bg-black text-white py-6 px-4 animate-pulse">
    <div className="container mx-auto overflow-hidden">
      <div className="flex gap-6 whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-8 w-48 bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export const ScalingSkeleton = () => (
  <section className="bg-[#f7f4f0] px-4 py-16 md:px-8 animate-pulse">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="space-y-4">
        <div className="h-12 w-full bg-gray-200 rounded"></div>
        <div className="h-12 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-6 w-full bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-full"></div>
        <div className="mt-7 p-4 bg-white rounded border space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="h-[500px] bg-gray-200 rounded-xl"></div>
    </div>
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </section>
);

export const CustomerTestimonialsSkeleton = () => (
  <div className="container mx-auto px-2 md:px-4 lg:px-4 py-12 bg-white animate-pulse">
    <div className="mb-12 space-y-4">
      <div className="h-10 w-2/3 bg-gray-200 rounded"></div>
      <div className="h-10 w-32 bg-gray-800 rounded-full"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-[440px] rounded-2xl bg-gray-200"></div>
      ))}
    </div>
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-2">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 space-y-2">
          <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-full bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

