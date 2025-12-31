import React from "react";
import { getHeroData } from "./actions";
import { HeroContentForm, ClientsManager } from "./_components";

export default async function HeroPage() {
  const data = await getHeroData();
  
  if (!data.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Error loading hero data: {data.error}</p>
          </div>
        </div>
      </div>
    );
  }

  const heroData = data.hero || {};
  const clients = heroData.clients || [];
  const heroContent = {
    badgeText: heroData.badgeText || "",
    mainHeading: heroData.mainHeading || "",
    description: heroData.description || "",
    ctaButtonText: heroData.ctaButtonText || "",
    ctaButtonLink: heroData.ctaButtonLink || "",
    icons: Array.isArray(heroData.icons) ? heroData.icons : []
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Hero Section Management
          </h1>
          <p className="text-gray-600">
            Manage your website's hero section content
          </p>
        </div>

        <HeroContentForm 
          initialData={heroContent}
          clients={clients}
        />

        <ClientsManager 
          initialClients={clients}
          heroContent={heroContent}
        />
      </div>
    </div>
  );
}
