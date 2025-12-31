"use client";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Edit3,
  Check,
} from "lucide-react";
import BlogsPreview from "./BlogsPreview";
import { saveHomepageBlogs } from "../actions";

const defaultHeader = {
  badgeText: "BLOG UNIVERSE",
  title: "Insights & Stories",
  description:
    "Dive into our collection of thoughts, tutorials, and insights from the world of design and development",
};

const GRADIENT_OPTIONS = [
  { label: "Blue → Teal", value: "from-blue-500 via-cyan-500 to-teal-500" },
  { label: "Purple → Pink", value: "from-purple-500 via-pink-500 to-red-500" },
  { label: "Green → Emerald", value: "from-green-500 via-emerald-500 to-cyan-500" },
  { label: "Orange → Red", value: "from-orange-500 via-red-500 to-pink-500" },
];

const normalizeItem = (item) => {
  if (!item) return null;
  if (typeof item === "string") {
    return { slug: item, overrides: {} };
  }
  if (item.slug) {
    return {
      slug: item.slug,
      overrides: item.overrides && typeof item.overrides === "object" ? item.overrides : {},
    };
  }
  return null;
};

const cleanOverrides = (overrides = {}) => {
  const cleaned = {};
  Object.entries(overrides).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === "string" && value.trim() === "") return;
    if (Array.isArray(value) && value.length === 0) return;
    if (key === "tags") {
      const arr = Array.isArray(value)
        ? value
        : String(value)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean);
      if (!arr.length) return;
      cleaned.tags = arr;
      return;
    }
    cleaned[key] = value;
  });
  return cleaned;
};

export default function BlogsEditor({ initialItems = [], initialHeader, initialSelection = [] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [allBlogs, setAllBlogs] = useState([]);
  const [query, setQuery] = useState("");
  const [header, setHeader] = useState({ ...defaultHeader, ...(initialHeader || {}) });

  const initialNormalized = useMemo(() => {
    if (Array.isArray(initialItems) && initialItems.length > 0) {
      return initialItems.map(normalizeItem).filter(Boolean);
    }
    if (Array.isArray(initialSelection) && initialSelection.length > 0) {
      return initialSelection.map(normalizeItem).filter(Boolean);
    }
    return [];
  }, [initialItems, initialSelection]);

  const [selectedItems, setSelectedItems] = useState(initialNormalized);
  const [editingIndex, setEditingIndex] = useState(null);

  // Fetch all blogs from admin API
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/blogs/get-blogs", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setAllBlogs(Array.isArray(data.blogs) ? data.blogs : []);
      } catch (e) {
        // ignore
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const blogMap = useMemo(() => new Map(allBlogs.map((b) => [b.slug, b])), [allBlogs]);

  const detailedItems = useMemo(() => {
    return selectedItems
      .map((item) => {
        if (!item) return null;
        const base = blogMap.get(item.slug) || {};
        const overrides = item.overrides || {};
        const tagsFromOverrides =
          typeof overrides.tags === "string"
            ? overrides.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
            : Array.isArray(overrides.tags)
            ? overrides.tags
            : null;
        const merged = {
          ...base,
          ...overrides,
          slug: item.slug,
          title: overrides.title ?? base.title ?? "Untitled",
          excerpt: overrides.excerpt ?? base.excerpt ?? "",
          author: overrides.author ?? base.author ?? "",
          category: overrides.category ?? base.category ?? "",
          date: overrides.date ?? base.date ?? "",
          readTime: overrides.readTime ?? base.readTime ?? "",
          views: overrides.views ?? base.views ?? "",
          gradient:
            overrides.gradient ??
            base.gradient ??
            "from-purple-500 via-pink-500 to-red-500",
          featured: overrides.featured ?? base.featured ?? false,
          tags:
            tagsFromOverrides ??
            (Array.isArray(base.tags) ? base.tags : []),
        };
        return { slug: item.slug, base, overrides, merged };
      })
      .filter(Boolean);
  }, [selectedItems, blogMap]);

  const previewItems = useMemo(() => {
    if (detailedItems.length === 0) {
      return allBlogs.slice(0, 3).map((base) => ({
        ...base,
        gradient: base?.gradient ?? GRADIENT_OPTIONS[0].value,
        featured: base?.featured ?? false,
        tags: Array.isArray(base?.tags) ? base.tags : [],
      }));
    }
    return detailedItems.map((item) => item.merged);
  }, [detailedItems, allBlogs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allBlogs;
    return allBlogs.filter((b) =>
      [b.title, b.author, b.category, b.slug].some((v) =>
        String(v || "").toLowerCase().includes(q)
      )
    );
  }, [query, allBlogs]);
  const selectedSlugSet = useMemo(
    () => new Set(selectedItems.map((i) => i.slug)),
    [selectedItems]
  );

  const addSlug = (slug) => {
    if (selectedItems.some((item) => item.slug === slug)) {
      toast.error("Already added");
      return;
    }
    setSelectedItems((items) => {
      const newItems = [...items, { slug, overrides: {} }];
      setEditingIndex(newItems.length - 1);
      return newItems;
    });
  };

  const removeSlug = (slug) => {
    setSelectedItems((items) => items.filter((item) => item.slug !== slug));
    setEditingIndex((idx) => {
      if (idx === null) return null;
      if (selectedItems.length <= 1) return null;
      if (selectedItems[idx]?.slug === slug) {
        return idx > 0 ? idx - 1 : 0;
      }
      const newIndex = selectedItems.findIndex((item) => item.slug === slug);
      if (newIndex >= 0 && newIndex < idx) {
        return idx - 1;
      }
      return idx;
    });
  };

  const moveUp = (idx) => {
    if (idx <= 0) return;
    setSelectedItems((items) => {
      const copy = [...items];
      [copy[idx - 1], copy[idx]] = [copy[idx], copy[idx - 1]];
      return copy;
    });
    setEditingIndex((current) => {
      if (current === idx) return idx - 1;
      if (current === idx - 1) return idx;
      return current;
    });
  };

  const moveDown = (idx) => {
    setSelectedItems((items) => {
      if (idx >= items.length - 1) return items;
      const copy = [...items];
      [copy[idx + 1], copy[idx]] = [copy[idx], copy[idx + 1]];
      return copy;
    });
    setEditingIndex((current) => {
      if (current === idx) return idx + 1;
      if (current === idx + 1) return idx;
      return current;
    });
  };

  const updateOverride = (idx, field, value) => {
    setSelectedItems((items) =>
      items.map((item, itemIdx) => {
        if (itemIdx !== idx) return item;
        return {
          ...item,
          overrides: {
            ...(item.overrides || {}),
            [field]: value,
          },
        };
      })
    );
  };

  const clearOverrides = (idx) => {
    setSelectedItems((items) =>
      items.map((item, itemIdx) => {
        if (itemIdx !== idx) return item;
        return { ...item, overrides: {} };
      })
    );
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payloadItems = selectedItems.map((item) => ({
        slug: item.slug,
        overrides: cleanOverrides(item.overrides),
      }));
      const res = await saveHomepageBlogs({ items: payloadItems, header });
      if (res.success) {
        toast.success("Homepage blogs saved");
        setTimeout(() => router.push("/home/feature"), 800);
      } else {
        toast.error(res.error || "Save failed");
      }
    } catch (e) {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrent = async (saveAndAdd = false) => {
    if (editingIndex === null) return;
    try {
      setLoading(true);
      const payloadItems = selectedItems.map((item) => ({
        slug: item.slug,
        overrides: cleanOverrides(item.overrides),
      }));
      const res = await saveHomepageBlogs({ items: payloadItems, header });
      if (res.success) {
        toast.success("Blog saved");
        if (saveAndAdd) {
          setEditingIndex(null);
          // optional: scroll right panel to All Blogs
        }
      } else {
        toast.error(res.error || "Save failed");
      }
    } catch {
      toast.error("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const editingItem = editingIndex !== null ? detailedItems[editingIndex] : null;

  const getInputValue = (field) => {
    if (!editingItem) return "";
    const { overrides, merged } = editingItem;
    if (field === "tags") {
    if (typeof overrides.tags === "string") {
      return overrides.tags;
    }
    const tagsArray = Array.isArray(overrides.tags)
      ? overrides.tags
      : Array.isArray(merged.tags)
      ? merged.tags
      : [];
    return tagsArray.join(", ");
    }
    if (field === "featured") {
      return overrides.featured ?? merged.featured ?? false;
    }
    return overrides[field] ?? merged[field] ?? "";
  };

  const handleFieldChange = (field, value) => {
    if (editingIndex === null) return;
    updateOverride(editingIndex, field, value);
  };

  const toggleFeatured = () => {
    if (editingIndex === null) return;
    const current = getInputValue("featured");
    updateOverride(editingIndex, "featured", !current);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Homepage Blogs</h1>
          <p className="text-sm text-gray-600 mt-1">
            Select, reorder and customize blogs that appear on the homepage
          </p>
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
        {/* Preview */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-5xl mx-auto">
            <BlogsPreview items={previewItems} header={header} />
          </div>
        </div>

        {/* Editor */}
        <div className="w-[560px] bg-white border-l overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold">Header Content</h2>
              <div>
                <label className="text-xs font-medium text-gray-600">Badge Text</label>
                <input
                  value={header.badgeText}
                  onChange={(e) => setHeader((h) => ({ ...h, badgeText: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="BLOG UNIVERSE"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Heading</label>
                <input
                  value={header.title}
                  onChange={(e) => setHeader((h) => ({ ...h, title: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Insights & Stories"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Subheading</label>
                <textarea
                  value={header.description}
                  onChange={(e) => setHeader((h) => ({ ...h, description: e.target.value }))}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Description shown under the heading"
                />
              </div>
            </div>

            {/* Selected list */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Selected (Homepage order)</h2>
              <div className="space-y-2">
                {detailedItems.map((item, idx) => (
                  <div
                    key={item.slug}
                    className={`border rounded-md p-3 flex items-center gap-3 ${
                      editingIndex === idx ? "border-blue-500 bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.merged.title}</div>
                      <div className="text-xs text-gray-500">
                        {item.merged.category} • {item.merged.author}
                      </div>
                    </div>
                    {item.merged.featured && (
                      <span className="text-[10px] uppercase font-semibold text-blue-600 border border-blue-200 rounded px-2 py-0.5">
                        Featured
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingIndex(idx)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => moveUp(idx)} className="p-1.5 hover:bg-gray-100 rounded">
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        className="p-1.5 hover:bg-gray-100 rounded"
                      >
                        <ArrowDown size={16} />
                      </button>
                      <button
                        onClick={() => removeSlug(item.slug)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                {detailedItems.length === 0 && (
                  <p className="text-sm text-gray-500">No blogs selected yet.</p>
                )}
              </div>
            </div>

            {/* Edit panel */}
            {editingItem && (
              <div className="border rounded-lg p-4 space-y-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">Customize: {editingItem.merged.title}</h3>
                  <button
                    onClick={() => clearOverrides(editingIndex)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Reset overrides
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600">Title</label>
                    <input
                      value={getInputValue("title")}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Excerpt</label>
                    <textarea
                      value={getInputValue("excerpt")}
                      onChange={(e) => handleFieldChange("excerpt", e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Author</label>
                      <input
                        value={getInputValue("author")}
                        onChange={(e) => handleFieldChange("author", e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Category</label>
                      <input
                        value={getInputValue("category")}
                        onChange={(e) => handleFieldChange("category", e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600">Date</label>
                      <input
                        value={getInputValue("date")}
                        onChange={(e) => handleFieldChange("date", e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="Jan 1, 2025"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Read Time</label>
                      <input
                        value={getInputValue("readTime")}
                        onChange={(e) => handleFieldChange("readTime", e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="6 min read"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600">Views</label>
                      <input
                        value={getInputValue("views")}
                        onChange={(e) => handleFieldChange("views", e.target.value)}
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        placeholder="15.2K"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Card Accent</label>
                    <select
                      value={
                        GRADIENT_OPTIONS.find((opt) => opt.value === getInputValue("gradient"))
                          ? getInputValue("gradient")
                          : GRADIENT_OPTIONS[0].value
                      }
                      onChange={(e) => handleFieldChange("gradient", e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    >
                      {GRADIENT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600">Tags (comma separated)</label>
                    <input
                      value={getInputValue("tags")}
                      onChange={(e) => handleFieldChange("tags", e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholder="AI, Design, UX"
                    />
                  </div>
                  <button
                    onClick={toggleFeatured}
                    className={`flex items-center gap-2 text-sm px-3 py-2 border rounded-md transition ${
                      getInputValue("featured")
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : "bg-white text-gray-600 border-gray-200"
                    }`}
                  >
                    <Check
                      size={16}
                      className={getInputValue("featured") ? "opacity-100" : "opacity-0"}
                    />
                    Mark as featured
                  </button>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleSaveCurrent(false)}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-black text-white rounded-md text-sm disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Save this blog
                    </button>
                    <button
                      onClick={() => handleSaveCurrent(true)}
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm disabled:opacity-50"
                      title="Save and switch to adding another blog"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Save & add another
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* All blogs list with search */}
            <div>
              <h2 className="text-lg font-semibold mb-3">All Blogs</h2>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title, author, category..."
                className="w-full border rounded-md px-3 py-2 text-sm mb-3"
              />
              <div className="space-y-2">
                {filtered
                  .filter((b) => !selectedSlugSet.has(b.slug))
                  .slice(0, 100)
                  .map((b) => (
                  <div key={b.slug} className="border rounded-md p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{b.title}</div>
                      <div className="text-xs text-gray-500">
                        {b.category} • {b.author}
                      </div>
                    </div>
                    <button
                      onClick={() => addSlug(b.slug)}
                      className="px-2 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-gray-500">No blogs found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

