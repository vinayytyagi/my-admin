"use client";
import React, { useState, useEffect, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import {
    X,
    Upload,
    Loader2,
    Star,
    Plus,
    Trash2,
    ImageIcon,
    Edit3,
    Save,
    Calendar,
    Tag,
    Globe,
    Smartphone,
    Monitor,
    Palette,
    Link,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/config";
import toast from "react-hot-toast";

const CreatePortfolioPage = () => {
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [ogImageUploading, setOgImageUploading] = useState(false);
    const [ogImagePreview, setOgImagePreview] = useState(null);
    const [mainImageUploading, setMainImageUploading] = useState(false);
    const [newCategory, setNewCategory] = useState("");
    const [localCategories, setLocalCategories] = useState([]);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [techInput, setTechInput] = useState("");

    const defaultCategories = [
        { name: "App", icon: Smartphone, color: "bg-blue-500" },
        { name: "Admin Dashboard", icon: Monitor, color: "bg-purple-500" },
        { name: "Website", icon: Globe, color: "bg-green-500" },
        { name: "UI/UX Design", icon: Palette, color: "bg-pink-500" },
    ];

    const [portfolioData, setPortfolioData] = useState({
        title: "",
        description: "",
        client: "",
        image: "",
        startDate: new Date(),
        completedAt: new Date(),
        status: "completed",
        categories: {},
        category: '',
        seo: {
            title: "",
            description: "",
            keywords: "",
            ogImageUrl: "",
            metaRobots: "index, follow",
            imageTitle: "",
            altText: ""
        }
    });

    useEffect(() => {
        setPortfolioData(prev => ({
            ...prev,
            categories: {}
        }));
    }, []);

    const addCustomCategory = () => {
        if (newCategoryName.trim() && !categories.find(cat => cat.name === newCategoryName.trim())) {
            const defaultCategory = defaultCategories.find(cat => cat.name === newCategoryName.trim());
            const newCategory = defaultCategory || {
                name: newCategoryName.trim(),
                icon: Edit3,
                color: "bg-gray-500"
            };

            setCategories([...categories, newCategory]);
            setPortfolioData(prev => ({
                ...prev,
                categories: {
                    ...prev.categories,
                    [newCategoryName.trim()]: {
                        content: "",
                        images: [],
                        topImages: [],
                        technologies: [],
                        links: []
                    }
                }
            }));
            setActiveCategory(newCategoryName.trim());
            setNewCategoryName("");
            setShowAddCategory(false);
        }
    };

    const removeCategory = (categoryName) => {
        setCategories(categories.filter(cat => cat.name !== categoryName));

        const updatedCategories = { ...portfolioData.categories };
        delete updatedCategories[categoryName];

        setPortfolioData(prev => ({
            ...prev,
            categories: updatedCategories
        }));

        if (activeCategory === categoryName) {
            setActiveCategory(categories.length > 1 ? categories[0].name : "");
        }
    };

    const uploadImageToFirebase = async (file) => {
        try {
            const storageRef = ref(storage, `portfolio-images/${Date.now()}-${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw error;
        }
    };

    const handleImageUpload = async (e, categoryName) => {
        const files = Array.from(e.target.files);

        for (const file of files) {
            if (!file.type.startsWith("image/")) continue;

            try {
                const downloadURL = await uploadImageToFirebase(file);

                const imageData = {
                    id: Date.now() + Math.random(),
                    url: downloadURL,
                    name: file.name,
                    isTop: false
                };

                setPortfolioData(prev => ({
                    ...prev,
                    categories: {
                        ...prev.categories,
                        [categoryName]: {
                            ...prev.categories[categoryName],
                            images: [...(prev.categories[categoryName]?.images || []), imageData]
                        }
                    }
                }));
            } catch (error) {
                console.error("Failed to upload image:", error);
                alert(`Failed to upload ${file.name}`);
            }
        }
    };

    const handleOgImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        setOgImageUploading(true);

        try {
            const downloadURL = await uploadImageToFirebase(file);

            setOgImagePreview(downloadURL);
            setPortfolioData(prev => ({
                ...prev,
                seo: {
                    ...prev.seo,
                    ogImageUrl: downloadURL
                }
            }));
        } catch (error) {
            console.error("Failed to upload OG image:", error);
            alert("Failed to upload image");
        } finally {
            setOgImageUploading(false);
        }
    };

    const handleMainImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) return;

        setMainImageUploading(true);

        try {
            // Upload to Firebase
            const downloadURL = await uploadImageToFirebase(file);

            setMainImagePreview(downloadURL);
            setPortfolioData(prev => ({
                ...prev,
                image: downloadURL
            }));
        } catch (error) {
            console.error("Failed to upload main image:", error);
            alert("Failed to upload image");
        } finally {
            setMainImageUploading(false);
        }
    };

    const removeOgImage = () => {
        setOgImagePreview(null);
        setPortfolioData(prev => ({
            ...prev,
            seo: {
                ...prev.seo,
                ogImageUrl: ""
            }
        }));
    };

    const removeMainImage = () => {
        setMainImagePreview(null);
        setPortfolioData(prev => ({
            ...prev,
            image: ""
        }));
    };

    const removeImage = (categoryName, imageId) => {
        setPortfolioData(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [categoryName]: {
                    ...prev.categories[categoryName],
                    images: prev.categories[categoryName].images.filter(img => img.id !== imageId),
                    topImages: prev.categories[categoryName].topImages.filter(id => id !== imageId)
                }
            }
        }));
    };

    const toggleTopImage = (categoryName, imageId) => {
        setPortfolioData(prev => {
            const currentTopImages = prev.categories[categoryName]?.topImages || [];
            let newTopImages;

            if (currentTopImages.includes(imageId)) {
                newTopImages = currentTopImages.filter(id => id !== imageId);
            } else if (currentTopImages.length < 5) {
                newTopImages = [...currentTopImages, imageId];
            } else {
                return prev;
            }

            return {
                ...prev,
                categories: {
                    ...prev.categories,
                    [categoryName]: {
                        ...prev.categories[categoryName],
                        topImages: newTopImages
                    }
                }
            };
        });
    };

    useEffect(() => {
        const savedCategories = localStorage.getItem("portfolioCategories");
        if (savedCategories) {
            setLocalCategories(JSON.parse(savedCategories));
        }
    }, []);

    const handleTechnologyInput = (e, categoryName) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tech = techInput.trim();
            if (tech) {
                setPortfolioData(prev => ({
                    ...prev,
                    categories: {
                        ...prev.categories,
                        [categoryName]: {
                            ...prev.categories[categoryName],
                            technologies: [...(prev.categories[categoryName]?.technologies || []), tech]
                        }
                    }
                }));
                setTechInput("");
            }
        }
    };

    const removeTechnology = (categoryName, tech) => {
        setPortfolioData(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [categoryName]: {
                    ...prev.categories[categoryName],
                    technologies: prev.categories[categoryName].technologies.filter(t => t !== tech)
                }
            }
        }));
    };

    const addLink = (categoryName) => {
        setPortfolioData(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [categoryName]: {
                    ...prev.categories[categoryName],
                    links: [...(prev.categories[categoryName]?.links || []), { title: "", url: "" }]
                }
            }
        }));
    };

    const updateLink = (categoryName, index, field, value) => {
        setPortfolioData(prev => {
            const updatedLinks = [...prev.categories[categoryName].links];
            updatedLinks[index][field] = value;

            return {
                ...prev,
                categories: {
                    ...prev.categories,
                    [categoryName]: {
                        ...prev.categories[categoryName],
                        links: updatedLinks
                    }
                }
            };
        });
    };

    const removeLink = (categoryName, index) => {
        setPortfolioData(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [categoryName]: {
                    ...prev.categories[categoryName],
                    links: prev.categories[categoryName].links.filter((_, i) => i !== index)
                }
            }
        }));
    };

    const updateCategoryContent = (categoryName, content) => {
        setPortfolioData(prev => ({
            ...prev,
            categories: {
                ...prev.categories,
                [categoryName]: {
                    ...prev.categories[categoryName],
                    content: content
                }
            }
        }));
    };

    const addCategory = () => {
        if (newCategory.trim() && !localCategories.includes(newCategory.trim())) {
            const updatedCategories = [...localCategories, newCategory.trim()];
            setLocalCategories(updatedCategories);
            localStorage.setItem("portfolioCategories", JSON.stringify(updatedCategories));
            setNewCategory("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (categories.length === 0) {
            alert("Please add at least one category before creating the portfolio.");
            return;
        }

        setLoading(true);

        try {
            const submitData = {
                ...portfolioData,
                startDate: portfolioData.startDate.toISOString(),
                completedAt: portfolioData.completedAt.toISOString(),
                categories: Object.fromEntries(
                    Object.entries(portfolioData.categories).map(([key, value]) => [
                        key,
                        {
                            ...value,
                            images: value.images.map(img => ({
                                id: img.id,
                                url: img.url,
                                name: img.name,
                                isTop: img.isTop
                            })),
                            topImages: value.topImages || [],
                            links: value.links || []
                        }
                    ])
                )
            };

            const response = await fetch("/api/portfolio/create-portfolio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create blog");
            }

            toast.success("Portfolio created successfully!");
        } catch (error) {
            console.error("Error creating portfolio:", error);
            toast.error("Failed to create portfolio");
        } finally {
            setLoading(false);
        }
    };

    const getCurrentCategoryData = () => {
        return portfolioData.categories[activeCategory] || { content: "", images: [], topImages: [], technologies: [], links: [] };
    };

    const categoryData = getCurrentCategoryData();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Portfolio Project</h1>
                    <p className="text-gray-600">Showcase your work across different categories</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Project Overview */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Edit3 className="mr-3 text-blue-500" size={24} />
                            Project Overview
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Project Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., VEDA - Healthcare Management System"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={portfolioData.title}
                                        onChange={(e) => setPortfolioData({ ...portfolioData, title: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Project Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        placeholder="Brief description of your project and its purpose"
                                        rows={12}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        value={portfolioData.description}
                                        onChange={(e) => setPortfolioData({ ...portfolioData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Client/Organization
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Healthcare Solutions Inc."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={portfolioData.client}
                                        onChange={(e) => setPortfolioData({ ...portfolioData, client: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Main Image (For Card Display) <span className="text-red-500">*</span>
                                        </label>
                                        {mainImagePreview ? (
                                            <div className="relative w-full h-[11.5rem] rounded-xl overflow-hidden border">
                                                <img
                                                    src={mainImagePreview}
                                                    alt="Main Preview"
                                                    className="w-full h-full object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeMainImage}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => document.getElementById("mainImageInput").click()}
                                                className="flex items-center justify-center w-full h-[11.5rem] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                            >
                                                {mainImageUploading ? (
                                                    <Loader2 className="animate-spin text-blue-500" size={24} />
                                                ) : (
                                                    <Upload className="text-gray-400" size={24} />
                                                )}
                                            </div>
                                        )}
                                        <input
                                            id="mainImageInput"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleMainImageChange}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Calendar className="inline mr-2" size={16} />
                                            Start Date
                                        </label>
                                        <DatePicker
                                            selected={portfolioData.startDate}
                                            onChange={(date) => setPortfolioData({ ...portfolioData, startDate: date })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            dateFormat="MMMM d, yyyy"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            <Calendar className="inline mr-2" size={16} />
                                            Completion Date
                                        </label>
                                        <DatePicker
                                            selected={portfolioData.completedAt}
                                            onChange={(date) => setPortfolioData({ ...portfolioData, completedAt: date })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            dateFormat="MMMM d, yyyy"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Status
                                        </label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            value={portfolioData.status}
                                            onChange={(e) => setPortfolioData({ ...portfolioData, status: e.target.value })}
                                        >
                                            <option value="completed">Completed</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="planning">Planning</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={portfolioData.category}
                                            onChange={(e) =>
                                                setPortfolioData({ ...portfolioData, category: e.target.value })
                                            }
                                        >
                                            <option value="">Select a category</option>
                                            {localCategories.map((cat) => (
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
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Tabs */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Project Categories</h2>
                            <button
                                type="button"
                                onClick={() => setShowAddCategory(true)}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all text-sm font-medium"
                            >
                                <Plus size={16} className="mr-2" />
                                Add Category
                            </button>
                        </div>

                        {categories.length === 0 ? (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Plus className="text-blue-500" size={24} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories added yet</h3>
                                <p className="text-gray-500 mb-4">Add at least one category to showcase your project</p>
                                <button
                                    type="button"
                                    onClick={() => setShowAddCategory(true)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium"
                                >
                                    Add Your First Category
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Category Tabs */}
                                <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-100 rounded-xl">
                                    {categories.map((category) => {
                                        const IconComponent = category.icon;
                                        return (
                                            <div key={category.name} className="relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveCategory(category.name)}
                                                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${activeCategory === category.name
                                                        ? `${category.color} text-white shadow-md`
                                                        : "text-gray-600 hover:bg-white hover:shadow-sm"
                                                        }`}
                                                >
                                                    <IconComponent size={16} className="mr-2" />
                                                    {category.name}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCategory(category.name)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {activeCategory && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-lg font-semibold text-gray-700 mb-4">
                                                <Tag className="inline mr-2" size={20} />
                                                Technologies for {activeCategory}
                                            </label>

                                            <div className="mb-4">
                                                <input
                                                    type="text"
                                                    placeholder="Enter technologies separated by commas or press Enter"
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={techInput}
                                                    onChange={(e) => setTechInput(e.target.value)}
                                                    onKeyDown={(e) => handleTechnologyInput(e, activeCategory)}
                                                />
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Press Enter or comma to add a technology
                                                </p>
                                            </div>

                                            {categoryData.technologies?.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Selected Technologies:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {categoryData.technologies.map((tech) => (
                                                            <span
                                                                key={tech}
                                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center"
                                                            >
                                                                {tech}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeTechnology(activeCategory, tech)}
                                                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Links Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="block text-lg font-semibold text-gray-700">
                                                    <Link className="inline mr-2" size={20} />
                                                    Project Links for {activeCategory}
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => addLink(activeCategory)}
                                                    className="flex items-center px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium"
                                                >
                                                    <Plus size={14} className="mr-1" />
                                                    Add Link
                                                </button>
                                            </div>

                                            {categoryData.links?.length > 0 ? (
                                                <div className="space-y-3">
                                                    {categoryData.links.map((link, index) => (
                                                        <div key={index} className="flex gap-2 items-start">
                                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Link Title (e.g., Live Demo, GitHub)"
                                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    value={link.title}
                                                                    onChange={(e) => updateLink(activeCategory, index, "title", e.target.value)}
                                                                />
                                                                <input
                                                                    type="url"
                                                                    placeholder="https://example.com"
                                                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                                    value={link.url}
                                                                    onChange={(e) => updateLink(activeCategory, index, "url", e.target.value)}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeLink(activeCategory, index)}
                                                                className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                                    <Link className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                                    <p className="text-gray-500">No links added yet</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Images Section */}
                                        <div>
                                            <div className="flex items-center justify-between mb-4">
                                                <label className="block text-lg font-semibold text-gray-700">
                                                    <ImageIcon className="inline mr-2" size={20} />
                                                    Images for {activeCategory}
                                                </label>
                                                <span className="text-sm text-gray-500">
                                                    Top Images: {categoryData.topImages?.length || 0}/5
                                                </span>
                                            </div>

                                            {/* Image Upload Area */}
                                            <div
                                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 transition-all bg-gray-50 hover:bg-blue-50"
                                                onClick={() => document.getElementById(`images-${activeCategory}`).click()}
                                            >
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-4 text-lg font-medium text-gray-600">
                                                    Click to upload images for {activeCategory}
                                                </div>
                                                <p className="text-sm text-gray-500 mt-2">
                                                    PNG, JPG, GIF up to 5MB each • Multiple images supported
                                                </p>
                                            </div>

                                            <input
                                                id={`images-${activeCategory}`}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => handleImageUpload(e, activeCategory)}
                                            />

                                            {categoryData.images?.length > 0 && (
                                                <div className="mt-6 overflow-x-auto max-w-5xl">
                                                    <div className="flex gap-4 pb-4 w-full">
                                                        {categoryData.images.map((image) => (
                                                            <div key={image.id} className="relative group flex-shrink-0">
                                                                <img
                                                                    src={image.url}
                                                                    alt={image.name}
                                                                    className="w-40 h-40 object-contain rounded-xl border border-gray-200"
                                                                />

                                                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all rounded-xl flex items-center justify-center">
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => toggleTopImage(activeCategory, image.id)}
                                                                            className={`p-2 rounded-lg transition-all ${categoryData.topImages?.includes(image.id)
                                                                                ? "bg-yellow-500 text-white"
                                                                                : "bg-white text-gray-700 hover:bg-yellow-100"
                                                                                }`}
                                                                            title={categoryData.topImages?.includes(image.id) ? "Remove from top" : "Mark as top"}
                                                                        >
                                                                            <Star size={16} />
                                                                        </button>

                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeImage(activeCategory, image.id)}
                                                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                                                            title="Delete image"
                                                                        >
                                                                            <Trash2 size={16} />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {categoryData.topImages?.includes(image.id) && (
                                                                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                                                        Top
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Editor */}
                                        <div>
                                            <label className="block text-lg font-semibold text-gray-700 mb-4">
                                                <Edit3 className="inline mr-2" size={20} />
                                                Content for {activeCategory}
                                            </label>

                                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                                <Editor
                                                    apiKey="kr3a1pnf8k70cf8449ke7y4i0p8xd4qoyo4ufg9857008jpr"
                                                    value={categoryData.content}
                                                    onEditorChange={(content) => updateCategoryContent(activeCategory, content)}
                                                    init={{
                                                        height: 400,
                                                        menubar: true,
                                                        plugins: [
                                                            "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                                            "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                                            "insertdatetime", "media", "table", "code", "help", "wordcount"
                                                        ],
                                                        toolbar:
                                                            "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                                                            "alignright alignjustify | bullist numlist outdent indent | " +
                                                            "removeformat | help | link image media",
                                                        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                                                        skin: "oxide",
                                                        content_css: "default"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Add Category Modal */}
                        {showAddCategory && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">Add New Category</h3>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddCategory(false)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 mb-2">Select from default categories or create a custom one:</p>
                                        <div className="grid grid-cols-2 gap-2 mb-4">
                                            {defaultCategories.map(category => (
                                                <button
                                                    key={category.name}
                                                    type="button"
                                                    onClick={() => {
                                                        setNewCategoryName(category.name);
                                                    }}
                                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${newCategoryName === category.name
                                                        ? `${category.color} text-white`
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    <category.icon size={14} className="mr-1" />
                                                    {category.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Or enter a custom category name:
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter category name"
                                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && addCustomCategory()}
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddCategory(false);
                                                setNewCategoryName("");
                                            }}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={addCustomCategory}
                                            disabled={!newCategoryName.trim()}
                                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add Category
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SEO Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <Globe className="mr-3 text-blue-500" size={24} />
                            SEO Details
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Meta Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter SEO meta title"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={portfolioData.seo.title}
                                        onChange={(e) =>
                                            setPortfolioData({
                                                ...portfolioData,
                                                seo: { ...portfolioData.seo, title: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                {/* Meta Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Description
                                    </label>
                                    <textarea
                                        rows={6}
                                        placeholder="Short SEO description"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        value={portfolioData.seo.description}
                                        onChange={(e) =>
                                            setPortfolioData({
                                                ...portfolioData,
                                                seo: { ...portfolioData.seo, description: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                {/* Meta Keywords */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Meta Keywords (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., healthcare, dashboard, react, node"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={portfolioData.seo.keywords}
                                        onChange={(e) =>
                                            setPortfolioData({
                                                ...portfolioData,
                                                seo: { ...portfolioData.seo, keywords: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {/* OG Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Open Graph Image
                                    </label>
                                    {ogImagePreview ? (
                                        <div className="relative w-full h-44 rounded-xl overflow-hidden border">
                                            <img
                                                src={ogImagePreview}
                                                alt="OG Preview"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeOgImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => document.getElementById("ogImageInput").click()}
                                            className="flex items-center justify-center w-full h-44 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                                        >
                                            {ogImageUploading ? (
                                                <Loader2 className="animate-spin text-blue-500" size={24} />
                                            ) : (
                                                <Upload className="text-gray-400" size={24} />
                                            )}
                                        </div>
                                    )}
                                    <input
                                        id="ogImageInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleOgImageChange}
                                    />
                                </div>

                                {/* Image Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="SEO image title"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={portfolioData.seo.imageTitle}
                                        onChange={(e) =>
                                            setPortfolioData({
                                                ...portfolioData,
                                                seo: { ...portfolioData.seo, imageTitle: e.target.value },
                                            })
                                        }
                                    />
                                </div>

                                {/* Alt Text */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Alt Text
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Describe the image for accessibility"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={portfolioData.seo.altText}
                                        onChange={(e) =>
                                            setPortfolioData({
                                                ...portfolioData,
                                                seo: { ...portfolioData.seo, altText: e.target.value },
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Section */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || !portfolioData.image}
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {loading ? "Creating..." : "Create Portfolio"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreatePortfolioPage;