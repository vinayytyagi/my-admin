"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, Edit3, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveSomeGlimpseData } from "../actions";
import SomeGlimpsePreview from "./SomeGlimpsePreview";

export default function SomeGlimpseEditor({ initialData }) {
  const router = useRouter();
  const [someGlimpseData, setSomeGlimpseData] = useState({
    stories: initialData?.stories || [],
    header: initialData?.header || {
      badgeText: "PROJECT STORIES",
      title: "Some Glimpse",
      description: "Journey through our most impactful projects and see how we transform ideas into digital experiences"
    }
  });
  const [loading, setLoading] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newStory, setNewStory] = useState({
    id: null,
    name: "",
    title: "",
    subtitle: "",
    description: "",
    mockupType: "mobile",
    gradient: "from-blue-500 via-purple-500 to-pink-500",
    color: "blue",
    stats: [{ label: "", value: "" }],
    features: [""]
  });

  // Sync state with props when server data changes
  useEffect(() => {
    if (initialData) {
      setSomeGlimpseData({
        stories: initialData.stories || [],
        header: initialData.header || {
          badgeText: "PROJECT STORIES",
          title: "Some Glimpse",
          description: "Journey through our most impactful projects and see how we transform ideas into digital experiences"
        }
      });
    }
  }, [initialData]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await saveSomeGlimpseData(someGlimpseData);
      
      if (result.success) {
        toast.success("SomeGlimpse section saved successfully!");
        // Redirect to feature page after a short delay
        setTimeout(() => {
          router.push('/home/feature');
        }, 1000);
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving SomeGlimpse data:", error);
      toast.error("Error saving SomeGlimpse data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = () => {
    setEditingIndex(null);
    setNewStory({
      id: Date.now().toString(),
      name: "",
      title: "",
      subtitle: "",
      description: "",
      mockupType: "mobile",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      color: "blue",
      stats: [{ label: "", value: "" }],
      features: [""]
    });
  };

  const handleEditStory = (index) => {
    setEditingIndex(index);
    setNewStory({ ...someGlimpseData.stories[index] });
  };

  const handleSaveStory = () => {
    if (!newStory.title || !newStory.subtitle) {
      toast.error("Please fill in title and subtitle");
      return;
    }

    const updatedStories = [...someGlimpseData.stories];
    
    if (editingIndex !== null) {
      updatedStories[editingIndex] = newStory;
    } else {
      updatedStories.push(newStory);
    }
    
    setSomeGlimpseData({ ...someGlimpseData, stories: updatedStories });
    setEditingIndex(null);
    setNewStory({
      id: null,
      name: "",
      title: "",
      subtitle: "",
      description: "",
      mockupType: "mobile",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      color: "blue",
      stats: [{ label: "", value: "" }],
      features: [""]
    });
    toast.success(editingIndex !== null ? "Story updated!" : "Story added!");
  };

  const handleDeleteStory = (index) => {
    if (confirm("Are you sure you want to delete this story?")) {
      const updatedStories = someGlimpseData.stories.filter((_, i) => i !== index);
      setSomeGlimpseData({ ...someGlimpseData, stories: updatedStories });
      toast.success("Story deleted!");
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setNewStory({
      id: null,
      name: "",
      title: "",
      subtitle: "",
      description: "",
      mockupType: "mobile",
      gradient: "from-blue-500 via-purple-500 to-pink-500",
      color: "blue",
      stats: [{ label: "", value: "" }],
      features: [""]
    });
  };

  const addStat = () => {
    setNewStory({ ...newStory, stats: [...newStory.stats, { label: "", value: "" }] });
  };

  const removeStat = (index) => {
    const updatedStats = newStory.stats.filter((_, i) => i !== index);
    setNewStory({ ...newStory, stats: updatedStats });
  };

  const updateStat = (index, field, value) => {
    const updatedStats = [...newStory.stats];
    updatedStats[index][field] = value;
    setNewStory({ ...newStory, stats: updatedStats });
  };

  const addFeature = () => {
    setNewStory({ ...newStory, features: [...newStory.features, ""] });
  };

  const removeFeature = (index) => {
    const updatedFeatures = newStory.features.filter((_, i) => i !== index);
    setNewStory({ ...newStory, features: updatedFeatures });
  };

  const updateFeature = (index, value) => {
    const updatedFeatures = [...newStory.features];
    updatedFeatures[index] = value;
    setNewStory({ ...newStory, features: updatedFeatures });
  };

  // Show preview of story being edited, or current active story
  const previewStory = (editingIndex !== null || newStory.id) ? newStory : null;

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SomeGlimpse Section Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage project stories and showcase content</p>
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
            <SomeGlimpsePreview
              header={someGlimpseData.header}
              stories={someGlimpseData.stories}
              previewStory={previewStory}
              editingIndex={editingIndex}
              newStory={newStory}
              activeStory={activeStory}
              setActiveStory={setActiveStory}
            />
          </div>
        </div>

        {/* Editor Section - Right */}
        <div className="w-[500px] bg-white border-l overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header Settings */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold mb-4">Header Settings</h2>
              <div className="space-y-4">
                <div>
                  <Label>Badge Text</Label>
                  <Input
                    value={someGlimpseData.header.badgeText}
                    onChange={(e) => setSomeGlimpseData({
                      ...someGlimpseData,
                      header: { ...someGlimpseData.header, badgeText: e.target.value }
                    })}
                    placeholder="e.g., PROJECT STORIES"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={someGlimpseData.header.title}
                    onChange={(e) => setSomeGlimpseData({
                      ...someGlimpseData,
                      header: { ...someGlimpseData.header, title: e.target.value }
                    })}
                    placeholder="e.g., Some Glimpse"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    value={someGlimpseData.header.description}
                    onChange={(e) => setSomeGlimpseData({
                      ...someGlimpseData,
                      header: { ...someGlimpseData.header, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    rows={3}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>

            {/* Stories Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Project Stories</h2>
                <button
                  onClick={handleAddStory}
                  className="flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600"
                >
                  <Plus size={16} />
                  Add Story
                </button>
              </div>

              {/* Add/Edit Form */}
              {(editingIndex !== null || newStory.id) && (
                <div className="border rounded-lg p-4 mb-4 bg-gray-50 max-h-[600px] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">
                      {editingIndex !== null ? "Edit Story" : "Add New Story"}
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
                      <Label className="text-xs">Name (for navigation button)</Label>
                      <Input
                        value={newStory.name}
                        onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
                        placeholder="e.g., Fintech Solution, E-Commerce"
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">This will appear in the story navigation buttons</p>
                    </div>
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={newStory.title}
                        onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                        placeholder="e.g., E-Commerce Revolution"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Subtitle</Label>
                      <Input
                        value={newStory.subtitle}
                        onChange={(e) => setNewStory({ ...newStory, subtitle: e.target.value })}
                        placeholder="e.g., Transforming Online Shopping"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Description</Label>
                      <textarea
                        value={newStory.description}
                        onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                        rows={3}
                        placeholder="Enter description"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Mockup Type</Label>
                      <select
                        value={newStory.mockupType}
                        onChange={(e) => setNewStory({ ...newStory, mockupType: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="mobile">Mobile</option>
                        <option value="desktop">Desktop</option>
                        <option value="tablet">Tablet</option>
                        <option value="laptop">Laptop</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Color</Label>
                      <select
                        value={newStory.color}
                        onChange={(e) => {
                          const gradients = {
                            blue: "from-blue-500 via-purple-500 to-pink-500",
                            green: "from-green-500 via-teal-500 to-blue-500",
                            purple: "from-purple-500 via-pink-500 to-red-500",
                            orange: "from-orange-500 via-red-500 to-pink-500"
                          };
                          setNewStory({ ...newStory, color: e.target.value, gradient: gradients[e.target.value] });
                        }}
                        className="w-full px-3 py-2 border rounded-md text-sm"
                      >
                        <option value="blue">Blue</option>
                        <option value="green">Green</option>
                        <option value="purple">Purple</option>
                        <option value="orange">Orange</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs">Gradient (Custom)</Label>
                      <Input
                        value={newStory.gradient}
                        onChange={(e) => setNewStory({ ...newStory, gradient: e.target.value })}
                        placeholder="e.g., from-blue-500 via-purple-500 to-pink-500"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Stats</Label>
                      <p className="text-xs text-gray-500 mb-2">First field = Stat Number (big display), Second field = Description (small text)</p>
                      {newStory.stats.map((stat, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={stat.label}
                            onChange={(e) => updateStat(index, 'label', e.target.value)}
                            placeholder="Stat Number (e.g., +340%, 98%)"
                            className="text-sm"
                          />
                          <Input
                            value={stat.value}
                            onChange={(e) => updateStat(index, 'value', e.target.value)}
                            placeholder="Description (e.g., Conversion Rate)"
                            className="text-sm"
                          />
                          <button
                            onClick={() => removeStat(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addStat}
                        className="text-blue-500 text-sm hover:text-blue-700"
                      >
                        + Add Stat
                      </button>
                    </div>
                    <div>
                      <Label className="text-xs">Features</Label>
                      {newStory.features.map((feature, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <Input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder="Feature name"
                            className="text-sm"
                          />
                          <button
                            onClick={() => removeFeature(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addFeature}
                        className="text-blue-500 text-sm hover:text-blue-700"
                      >
                        + Add Feature
                      </button>
                    </div>
                    <button
                      onClick={handleSaveStory}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg text-sm hover:bg-blue-600"
                    >
                      {editingIndex !== null ? "Update Story" : "Add Story"}
                    </button>
                  </div>
                </div>
              )}

              {/* Stories List */}
              <div className="space-y-3">
                {someGlimpseData.stories.map((story, index) => (
                  <div key={story.id || index} className="border rounded-lg p-3 bg-white">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{story.name || story.title || "Untitled"}</h4>
                        <p className="text-xs text-gray-500">{story.subtitle || "No subtitle"}</p>
                        <div className="flex gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{story.mockupType}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded">{story.color}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditStory(index)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteStory(index)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {someGlimpseData.stories.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-8">
                    No stories added yet. Click "Add Story" to get started.
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

