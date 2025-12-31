import React from "react";
import { getDesktopData } from "./actions";
import { DesktopEditor } from "./_components";

export default async function DesktopPage() {
  const data = await getDesktopData();
  
  if (!data.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
          <p className="text-red-800">Error loading desktop data: {data.error}</p>
        </div>
      </div>
    );
  }

  const desktopData = data.desktop || {};
  const initialData = {
    apps: desktopData.apps || [],
    header: desktopData.header || {
      badgeText: "Desktop Experience",
      title: "Our Featured Projects Showcase",
      description: "From initial design concepts to final development, we handle the complete process to deliver exceptional digital experiences"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopEditor initialData={initialData} />
    </div>
  );
}
