"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { storage } from '@/firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SponsoredCarousel from '@/components/SponsoredCarousel';

const SponsoredAdmin = () => {
  const [formData, setFormData] = useState({
    heading: "",
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    fetchSponsoredData();
  }, []);

  const fetchSponsoredData = async () => {
    try {
      const response = await fetch('/api/sponsored/get-sponsored');
      const data = await response.json();
      
      if (data.success && data.items && data.items.length > 0) {
        const carouselData = data.items[0];
        setExistingData(carouselData);
        setFormData({
          heading: carouselData.heading || "",
          images: carouselData.images || []
        });
      }
    } catch (error) {
      console.error("Error fetching sponsored data:", error);
    }
  };

  const handleHeadingChange = (e) => {
    setFormData({ ...formData, heading: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const storageRef = ref(storage, `sponsored/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { url: downloadURL, href: "", label: "" }]
      }));
      
      setMessage("Image uploaded successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Error uploading image");
    } finally {
      setLoading(false);
    }
  };

  const updateImageField = (index, field, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index][field] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const removeImage = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let response;
      
      if (existingData) {
        // Update existing document
        response = await fetch(`/api/sponsored/update-sponsored?id=${existingData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new document
        response = await fetch('/api/sponsored/add-sponsored', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      
      const result = await response.json();
      
      if (result.success) {
        setMessage("Carousel saved successfully!");
        if (!existingData) {
          fetchSponsoredData();
        }
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving carousel:", error);
      setMessage("Error saving carousel");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 grid-cols-2 p-6">
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-6">Sponsored Carousel</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              value={formData.heading}
              onChange={handleHeadingChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter carousel heading"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {formData.images.map((image, index) => (
            <div key={index} className="border p-4 rounded-md space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Image {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
              
              <div className="h-40 relative bg-gray-100 rounded-md overflow-hidden">
                <Image
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={image.label}
                  onChange={(e) => updateImageField(index, 'label', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter image label"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL
                </label>
                <input
                  type="url"
                  value={image.href}
                  onChange={(e) => updateImageField(index, 'href', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          ))}
          
          <button
            type="submit"
            disabled={loading || formData.images.length === 0}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : 'Save Carousel'}
          </button>
          
          {message && (
            <div className={`p-3 rounded-md ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
      
      <div className="col-span-1 ml-5">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <SponsoredCarousel heading={formData.heading} images={formData.images} />
      </div>
    </div>
  );
};

export default SponsoredAdmin;