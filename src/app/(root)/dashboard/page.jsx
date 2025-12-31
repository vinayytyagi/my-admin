"use client";
import React from "react";

const Home = () => {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10 text-center">
      <div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
          Welcome to Xenotix Tech Dashboard
        </h1>
        <p className="text-gray-700 mt-2 text-lg">
          Empowering innovation, one solution at a time.
        </p>
        <p className="text-sm text-gray-500 mt-1">{today}</p>
      </div>

      <div className="border border-dashed border-orange-400 bg-white rounded-md p-6 mt-8 max-w-3xl text-gray-800 shadow-sm">
        <p>
          Our team is working hard behind the scenes! Soon, you’ll have access
          to powerful tools, analytics, and features designed to enhance your
          Xenotix Tech experience. Stay tuned and get ready to build the future!
        </p>
      </div>

      <p className="mt-8 italic text-gray-600">
        "Innovation distinguishes between a leader and a follower." – Steve Jobs
      </p>
    </div>
  );
};

export default Home;
