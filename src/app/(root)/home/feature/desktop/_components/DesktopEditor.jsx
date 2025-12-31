"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, Edit3, Loader2 } from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/ui/ImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveDesktopData } from "../actions";
import DesktopPreview from "./DesktopPreview";

export default function DesktopEditor({ initialData }) {
  const router = useRouter();
  const [desktopData, setDesktopData] = useState({
    apps: initialData?.apps || [],
    header: initialData?.header || {
      badgeText: "Desktop Experience",
      title: "Our Featured Projects Showcase",
      description: "From initial design concepts to final development, we handle the complete process to deliver exceptional digital experiences"
    }
  });
  const [loading, setLoading] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newApp, setNewApp] = useState({
    id: null,
    title: "",
    subtitle: "",
    author: "",
    image: ""
  });

  // Sync state with props when server data changes
  useEffect(() => {
    if (initialData) {
      setDesktopData({
        apps: initialData.apps || [],
        header: initialData.header || {
          badgeText: "Desktop Experience",
          title: "Our Featured Projects Showcase",
          description: "From initial design concepts to final development, we handle the complete process to deliver exceptional digital experiences"
        }
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await saveDesktopData(desktopData);
      
      if (result.success) {
        toast.success("Desktop section saved successfully!");
        // Redirect to feature page after a short delay
        setTimeout(() => {
          router.push('/home/feature');
        }, 1000);
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving desktop data:", error);
      toast.error("Error saving desktop data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddApp = () => {
    setEditingIndex(null);
    setNewApp({
      id: Date.now().toString(),
      title: "",
      subtitle: "",
      author: "",
      image: ""
    });
  };

  const handleEditApp = (index) => {
    setEditingIndex(index);
    setNewApp({ ...desktopData.apps[index] });
  };

  const handleSaveApp = () => {
    if (!newApp.image) {
      toast.error("Please upload an image");
      return;
    }

    const updatedApps = [...desktopData.apps];
    
    if (editingIndex !== null) {
      updatedApps[editingIndex] = newApp;
    } else {
      updatedApps.push(newApp);
    }
    
    setDesktopData({ ...desktopData, apps: updatedApps });
    setEditingIndex(null);
    setNewApp({
      id: null,
      title: "",
      subtitle: "",
      author: "",
      image: ""
    });
    toast.success(editingIndex !== null ? "App updated!" : "App added!");
  };

  const handleDeleteApp = (index) => {
    if (confirm("Are you sure you want to delete this app?")) {
      const updatedApps = desktopData.apps.filter((_, i) => i !== index);
      setDesktopData({ ...desktopData, apps: updatedApps });
      toast.success("App deleted!");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewApp({
      id: null,
      title: "",
      subtitle: "",
      author: "",
      image: ""
    });
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Desktop Section Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage desktop app showcase images and content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save
            </>
          )}
        </button>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Preview Section - Left */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto">
            <DesktopPreview apps={desktopData.apps} dataLoading={false} />
          </div>
        </div>

        {/* Editor Section - Right */}
        <div className="w-[450px] bg-white border-l overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header Settings */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-4">Header Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label>Badge Text</Label>
                  <Input
                    value={desktopData.header.badgeText}
                    onChange={(e) => setDesktopData({
                      ...desktopData,
                      header: { ...desktopData.header, badgeText: e.target.value }
                    })}
                    placeholder="e.g., Desktop Experience"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={desktopData.header.title}
                    onChange={(e) => setDesktopData({
                      ...desktopData,
                      header: { ...desktopData.header, title: e.target.value }
                    })}
                    placeholder="e.g., Our Featured Projects Showcase"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    value={desktopData.header.description}
                    onChange={(e) => setDesktopData({
                      ...desktopData,
                      header: { ...desktopData.header, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    rows={3}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>

            {/* Apps Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Desktop Apps</h2>
                <button
                  onClick={handleAddApp}
                  className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600"
                >
                  <Plus size={16} />
                  Add App
                </button>
              </div>

              {/* Add/Edit Form */}
              {(editingIndex !== null || newApp.id) && (
                <div className="border rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">
                      {editingIndex !== null ? "Edit App" : "Add New App"}
                    </h3>
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={newApp.title}
                        onChange={(e) => setNewApp({ ...newApp, title: e.target.value })}
                        placeholder="e.g., Modern Dashboard Interface"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Subtitle</Label>
                      <Input
                        value={newApp.subtitle}
                        onChange={(e) => setNewApp({ ...newApp, subtitle: e.target.value })}
                        placeholder="e.g., Analytics Platform"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Author</Label>
                      <Input
                        value={newApp.author}
                        onChange={(e) => setNewApp({ ...newApp, author: e.target.value })}
                        placeholder="e.g., UI/UX Designer"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <ImageUpload
                        label="App Image"
                        value={newApp.image}
                        onChange={(url) => setNewApp({ ...newApp, image: url })}
                        folder="home/desktop"
                        className="text-xs"
                      />
                    </div>
                    <button
                      onClick={handleSaveApp}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600"
                    >
                      {editingIndex !== null ? "Update App" : "Add App"}
                    </button>
                  </div>
                </div>
              )}

              {/* Apps List */}
              <div className="space-y-3">
                {desktopData.apps.map((app, index) => (
                  <div key={app.id || index} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {app.image ? (
                          <Image
                            src={app.image}
                            alt={app.title}
                            width={80}
                            height={64}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{app.title || "Untitled"}</h4>
                        <p className="text-xs text-gray-500 truncate">{app.subtitle || "No subtitle"}</p>
                        <p className="text-xs text-gray-400 truncate">{app.author || "No author"}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditApp(index)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteApp(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {desktopData.apps.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">
                    No apps added yet. Click "Add App" to get started.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

