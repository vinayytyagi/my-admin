import React from "react";
import { getMobileData } from "./actions";
import { MobileEditor } from "./_components";

export default async function MobilePage() {
  const data = await getMobileData();
  
  if (!data.success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 m-6">
          <p className="text-red-800">Error loading mobile data: {data.error}</p>
        </div>
      </div>
    );
  }

  const mobileData = data.mobile || {};
  const initialData = {
    apps: mobileData.apps || [],
    header: mobileData.header || {
      badgeText: "Mobile Experience",
      title: "Creating Awesome UI/UX Experiences",
      description: "We specialize in creating exceptional UI/UX designs that deliver outstanding digital experiences"
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <MobileEditor initialData={initialData} />
    </div>
  );
}
