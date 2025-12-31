"use client";

import React from "react";

export default function MockupDevicePreview({ type, gradient, title, features }) {
  const deviceStyles = {
    mobile: "w-48 h-96 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-2 shadow-2xl border border-gray-700",
    desktop: "w-80 h-48 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-lg p-2 shadow-2xl border border-gray-700",
    tablet: "w-64 h-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-2 shadow-2xl border border-gray-700",
    laptop: "w-80 h-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-t-xl shadow-2xl border-t border-l border-r border-gray-700"
  };

  const screenStyles = {
    mobile: "w-full h-full bg-gradient-to-br rounded-[1.5rem] flex flex-col overflow-hidden relative border border-gray-600",
    desktop: "w-full h-full bg-gradient-to-br rounded-md flex flex-col overflow-hidden relative border border-gray-600",
    tablet: "w-full h-full bg-gradient-to-br rounded-[1.5rem] flex flex-col overflow-hidden relative border border-gray-600",
    laptop: "w-full h-full bg-gradient-to-br rounded-t-xl flex flex-col overflow-hidden relative border-t border-l border-r border-gray-600"
  };

  return (
    <div className="relative">
      <div className={`absolute -inset-4 bg-gradient-to-r ${gradient} rounded-[4rem] blur-2xl opacity-20`} />
      <div className={deviceStyles[type]}>
        <div className={`${screenStyles[type]} ${gradient}`}>
          {type === 'mobile' && (
            <div className="flex justify-between items-center px-4 py-2 text-white text-xs bg-black/10 backdrop-blur-sm">
              <span className="font-semibold">9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-1 h-3 bg-white rounded-full" />
                <div className="text-xs opacity-80">5G</div>
              </div>
            </div>
          )}
          {(type === 'desktop' || type === 'laptop') && (
            <div className="flex items-center gap-2 px-3 py-2 bg-black/20 backdrop-blur-sm border-b border-white/10">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="flex-1 mx-2 bg-white/10 rounded-lg px-2 py-1 text-white/80 text-xs">
                {title?.toLowerCase().replace(/\s+/g, '') || 'app'}.app
              </div>
            </div>
          )}
          <div className="flex-1 p-4 text-white relative overflow-hidden">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl mx-auto mb-2 flex items-center justify-center">
                <div className="w-6 h-6 bg-white/30 rounded-lg" />
              </div>
              <div className="text-sm font-bold opacity-95 mb-1">{title || "App Title"}</div>
              <div className="text-xs opacity-75 px-2 py-0.5 bg-white/10 rounded-full inline-block">Premium</div>
            </div>
            <div className="space-y-2">
              {features?.slice(0, type === 'mobile' ? 2 : 3).map((feature, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                  <div className="w-6 h-6 bg-white/30 rounded-lg flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-sm" />
                  </div>
                  <div className="flex-1 text-xs font-semibold opacity-95">{feature || "Feature"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {type === 'mobile' && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black rounded-full border border-gray-600" />
      )}
      {type === 'laptop' && (
        <div className="w-full h-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-xl -mt-1 mx-auto relative border-b border-l border-r border-gray-700">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gray-700 rounded-full" />
        </div>
      )}
      {type === 'desktop' && (
        <>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-4 h-12 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg" />
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full" />
        </>
      )}
    </div>
  );
}

