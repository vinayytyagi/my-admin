"use client";

import { useState, useRef, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";

export default function ImageUpload({ 
  value = "", 
  onChange, 
  label = "Image URL",
  folder = "services",
  className = ""
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const fileInputRef = useRef(null);

  // Update preview when value changes externally
  useEffect(() => {
    if (value) {
      setPreview(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase
    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Upload error:", error);
          alert("Image upload failed");
          setUploading(false);
          setPreview(null);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploading(false);
          onChange(downloadURL);
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      alert("Image upload failed");
      setUploading(false);
      setPreview(null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    onChange(url);
    if (url) {
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className={className}>
      <Label>{label}</Label>
      <div className="space-y-2">
        {/* Preview */}
        {preview && (
          <div className="relative w-full h-32 border rounded-md overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
              onError={() => setPreview(null)}
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              aria-label="Remove image"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload
              </>
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* URL Input */}
        <Input
          type="url"
          value={value || ""}
          onChange={handleUrlChange}
          placeholder="Or paste image URL here"
          className="text-xs"
        />
      </div>
    </div>
  );
}

