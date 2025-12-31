"use client";
import React from "react";
import Link from "next/link";
import { Smartphone, Monitor, ArrowRight } from "lucide-react";

const FeaturePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Feature Section Management
          </h1>
          <p className="text-gray-600">
            Manage your website's mobile and desktop showcase sections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mobile Section Card */}
          <Link href="/home/feature/mobile">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <Smartphone className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mobile Section</h2>
                    <p className="text-sm text-gray-500">Manage mobile app showcases</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Edit mobile app images that appear inside the phone frame. Control the images displayed in the mobile showcase carousel.
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:gap-3 transition-all">
                  <span>Manage Mobile Section</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Section Card */}
          <Link href="/home/feature/desktop">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Desktop Section</h2>
                    <p className="text-sm text-gray-500">Manage desktop app showcases</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Edit desktop app images that appear inside the browser frame. Control the images displayed in the desktop showcase carousel.
                </p>
                <div className="flex items-center text-purple-600 font-medium group-hover:gap-3 transition-all">
                  <span>Manage Desktop Section</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* SomeGlimpse Section Card */}
          <Link href="/home/feature/someglimpse">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">SomeGlimpse</h2>
                    <p className="text-sm text-gray-500">Manage project stories</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Edit project stories with mockup devices, stats, and features. Control the content displayed in the SomeGlimpse showcase section.
                </p>
                <div className="flex items-center text-pink-600 font-medium group-hover:gap-3 transition-all">
                  <span>Manage SomeGlimpse</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;
