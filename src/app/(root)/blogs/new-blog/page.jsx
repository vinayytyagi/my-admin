"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@tinymce/tinymce-react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { toast } from "react-hot-toast";
import { X, Upload, Loader2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from "uuid";
import { auth } from "@/firebase/config";

const CreateBlogPage = () => {
  const router = useRouter();
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [ogImageUploading, setOgImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [ogImagePreview, setOgImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [editorLoading, setEditorLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    imageUrl: "",
    category: "",
    tags: [],
    status: "active",
    createdAt: new Date(),
    author: "",
    viewCount: 0,
    seo: {
      title: "",
      description: "",
      keywords: "",
      ogImageUrl: "",
      metaRobots: "index, follow",
      imageTitle: "",
      altText: ""
    },
  });

  // Load categories from localStorage or set defaults
  useEffect(() => {
    const savedCategories = localStorage.getItem("blogCategories");
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }

    const savedTags = localStorage.getItem("blogTags");
    if (savedTags) {
      setTags(JSON.parse(savedTags));
    }
  }, []);

  const handleImageChange = (e, type = "main") => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (type === "main") {
        setImagePreview(reader.result);
      } else {
        setOgImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);

    const uploadImage = async () => {
      try {
        if (type === "main") {
          setImageUploading(true);
        } else {
          setOgImageUploading(true);
        }

        const storageRef = ref(storage, `blog-images/${uuidv4()}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            toast.error("Image upload failed");
            console.error("Upload error:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            if (type === "main") {
              setFormData((prev) => ({ ...prev, imageUrl: downloadURL }));
              setImageUploading(false);
            } else {
              setFormData((prev) => ({
                ...prev,
                seo: { ...prev.seo, ogImageUrl: downloadURL },
              }));
              setOgImageUploading(false);
            }
            toast.success("Image uploaded successfully");
          }
        );
      } catch (error) {
        toast.error("Image upload failed");
        console.error("Upload error:", error);
        if (type === "main") {
          setImageUploading(false);
        } else {
          setOgImageUploading(false);
        }
      }
    };

    uploadImage();
  };

  const removeImage = (type = "main") => {
    if (type === "main") {
      setImagePreview(null);
      setFormData((prev) => ({ ...prev, imageUrl: "" }));
    } else {
      setOgImagePreview(null);
      setFormData((prev) => ({
        ...prev,
        seo: { ...prev.seo, ogImageUrl: "" },
      }));
    }
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      localStorage.setItem("blogCategories", JSON.stringify(updatedCategories));
      setNewCategory("");
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      localStorage.setItem("blogTags", JSON.stringify(updatedTags));
      setNewTag("");
    }
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editorRef.current) {
        const content = editorRef.current.getContent();
        setFormData((prev) => ({ ...prev, content }));
      }

      if (!formData.title || !formData.content) {
        throw new Error("Title and content are required");
      }
      const blogData = {
        ...formData,
        createdAt: formData.createdAt.toISOString(),
        tags: formData.tags.join(', '),
        updatedAt: new Date().toISOString(),
        ...formData.seo,
        metaAuthor: formData.author,
        keywords: formData.seo.keywords,
      };

      const response = await fetch("/api/blogs/create-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create blog");
      }

      toast.success("Blog created successfully!");
      router.push(`https://xenotix-eight.vercel.app/blogs/${data.slug}`);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error(error.message || "Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Blog Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Blog Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter blog title"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Blog Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                placeholder="Enter a short description for your blog"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image
              </label>
              <div className="space-y-3">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Blog preview"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage("main")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="border-2 h-[155px] flex items-center justify-center flex-col border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onClick={() => document.getElementById("blogImage").click()}
                  >
                    {imageUploading ? (
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                        <p className="mt-2 text-sm text-gray-600">
                          Uploading image...
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium text-blue-500">
                            Click to upload
                          </span>{" "}
                          or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                )}

                <input
                  id="blogImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(e, "main")}
                  disabled={imageUploading}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <div className="mt-2 flex">
                <input
                  type="text"
                  placeholder="Add new category"
                  className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addCategory}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.tags.includes(tag)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Add new tag"
                  className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 text-sm"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter author name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
              />
            </div>

            {/* Publish Date and Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date
                </label>
                <DatePicker
                  selected={formData.createdAt}
                  onChange={(date) =>
                    setFormData({ ...formData, createdAt: date })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  dateFormat="MMMM d, yyyy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Content Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content <span className="text-red-500">*</span>
          </label>
          {
            <Editor
              apiKey={"kr3a1pnf8k70cf8449ke7y4i0p8xd4qoyo4ufg9857008jpr"}
              onInit={(evt, editor) => {
                editorRef.current = editor;
                setEditorLoading(false);
              }}
              initialValue={formData.content}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "visualblocks",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "media",
                  "table",
                  "code",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help | link image media",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                images_upload_handler: async (blobInfo, progress) => {
                  return new Promise((resolve, reject) => {
                    const file = blobInfo.blob();
                    const storageRef = ref(storage, `blog-images/${uuidv4()}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    uploadTask.on(
                      "state_changed",
                      (snapshot) => {
                        progress(
                          (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100
                        );
                      },
                      (error) => {
                        reject("Image upload failed: " + error.message);
                      },
                      async () => {
                        const downloadURL = await getDownloadURL(
                          uploadTask.snapshot.ref
                        );
                        resolve(downloadURL);
                      }
                    );
                  });
                },
              }}
            />
          }
        </div>

        {/* SEO Section - Moved below the editor */}
        <div className="border-t pt-6">
          <h2 className="text-xl font-bold mb-4">SEO Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Meta Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title{" "}
                  <span className="text-gray-500 text-xs">
                    (Ideal length: 50-60 characters)
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Enter meta title"
                  maxLength={60}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.seo.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, title: e.target.value },
                    }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seo.title.length}/60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description{" "}
                  <span className="text-gray-500 text-xs">
                    (Ideal length: 180-220 characters)
                  </span>
                </label>
                <textarea
                  placeholder="Enter meta description"
                  maxLength={220}
                  className="w-full h-48 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[80px]"
                  value={formData.seo.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, description: e.target.value },
                    }))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seo.description.length}/220 characters
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Meta Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., technology, web development, nextjs"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.seo.keywords}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      seo: { ...prev.seo, keywords: e.target.value },
                    }))
                  }
                />
              </div>

              {/* Meta Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Image
                </label>
                <div className="space-y-3">
                  {ogImagePreview ? (
                    <div className="relative">
                      <img
                        src={ogImagePreview}
                        alt="Meta image preview"
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("og")}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
                      onClick={() => document.getElementById("ogImage").click()}
                    >
                      {ogImageUploading ? (
                        <div className="flex flex-col items-center justify-center">
                          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                          <p className="mt-2 text-sm text-gray-600">
                            Uploading image...
                          </p>
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-8 w-8 text-gray-400" />
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium text-blue-500">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <input
                    id="ogImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, "og")}
                    disabled={ogImageUploading}
                  />
                </div>
              </div>

              {/* Image Title and Alt Text */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter image title"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.seo.imageTitle || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, imageTitle: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    placeholder="Enter alt text"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.seo.altText || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        seo: { ...prev.seo, altText: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => router.push("/blogs")}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              loading || imageUploading || ogImageUploading || editorLoading
            }
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Publish Blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlogPage;
