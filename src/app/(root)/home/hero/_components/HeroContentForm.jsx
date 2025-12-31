"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Save, Loader2, X } from "lucide-react";
import { saveHeroData } from "../actions";

export default function HeroContentForm({ initialData, clients }) {
  const router = useRouter();
  const [heroContent, setHeroContent] = useState({
    badgeText: initialData?.badgeText || "",
    mainHeading: initialData?.mainHeading || "",
    description: initialData?.description || "",
    ctaButtonText: initialData?.ctaButtonText || "",
    ctaButtonLink: initialData?.ctaButtonLink || "",
    icons: Array.isArray(initialData?.icons) ? initialData.icons : []
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newIconUrl, setNewIconUrl] = useState("");

  // Sync state with props when server data changes (only when form is closed)
  useEffect(() => {
    if (!showForm) {
      setHeroContent({
        badgeText: initialData?.badgeText || "",
        mainHeading: initialData?.mainHeading || "",
        description: initialData?.description || "",
        ctaButtonText: initialData?.ctaButtonText || "",
        ctaButtonLink: initialData?.ctaButtonLink || "",
        icons: Array.isArray(initialData?.icons) ? initialData.icons : []
      });
    }
  }, [initialData, showForm]);

  const handleHeroContentChange = (e) => {
    const { name, value } = e.target;
    setHeroContent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addIcon = () => {
    if (newIconUrl.trim()) {
      setHeroContent(prev => ({
        ...prev,
        icons: [...prev.icons, newIconUrl.trim()]
      }));
      setNewIconUrl("");
    }
  };

  const removeIcon = (index) => {
    setHeroContent(prev => ({
      ...prev,
      icons: prev.icons.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await saveHeroData({
        clients: clients,
        ...heroContent
      });
      
      if (result.success) {
        toast.success("Hero content saved successfully!");
        setShowForm(false);
        // Refresh the page to get updated data from server
        router.refresh();
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving hero content:", error);
      toast.error("Error saving hero content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Hero Content</h2>
          <p className="text-sm text-gray-600 mt-1">Manage badge, heading, description, and CTA button</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
        >
          {showForm ? 'Cancel' : 'Edit Hero Content'}
        </button>
      </div>

      {showForm ? (
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge Text
              </label>
              <input
                type="text"
                name="badgeText"
                value={heroContent.badgeText}
                onChange={handleHeroContentChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., Xenotix Tech"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                name="ctaButtonText"
                value={heroContent.ctaButtonText}
                onChange={handleHeroContentChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., All integrations"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CTA Button Link
              </label>
              <input
                type="text"
                name="ctaButtonLink"
                value={heroContent.ctaButtonLink}
                onChange={handleHeroContentChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="e.g., /integrations or #"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Main Heading
            </label>
            <textarea
              name="mainHeading"
              value={heroContent.mainHeading}
              onChange={handleHeroContentChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter main heading (use \n for line breaks)"
            />
            <p className="text-xs text-gray-500 mt-1">Use \n for line breaks in the heading</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={heroContent.description}
              onChange={handleHeroContentChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter description text"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icons (Optional)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newIconUrl}
                onChange={(e) => setNewIconUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIcon())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Enter icon URL (e.g., /file.svg)"
              />
              <button
                type="button"
                onClick={addIcon}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Add Icon
              </button>
            </div>
            {heroContent.icons.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {heroContent.icons.map((icon, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                    <span className="text-sm text-gray-700">{icon}</span>
                    <button
                      type="button"
                      onClick={() => removeIcon(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Hero Content
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Badge Text</p>
              <p className="text-sm font-medium text-gray-800">{heroContent.badgeText || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">CTA Button Text</p>
              <p className="text-sm font-medium text-gray-800">{heroContent.ctaButtonText || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">CTA Button Link</p>
              <p className="text-sm font-medium text-gray-800">{heroContent.ctaButtonLink || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Icons Count</p>
              <p className="text-sm font-medium text-gray-800">{heroContent.icons.length} icon(s)</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Main Heading</p>
              <p className="text-sm font-medium text-gray-800">{heroContent.mainHeading || "Not set"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-sm font-medium text-gray-800">{heroContent.description || "Not set"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

