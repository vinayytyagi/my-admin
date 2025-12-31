"use client";

import React, { useState, useEffect } from "react";
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Upload, X, Save, Plus, Edit3, Trash2, Loader2 } from 'lucide-react';
import { saveHeroData } from "../actions";

export default function ClientsManager({ initialClients, heroContent }) {
  const router = useRouter();
  const [clients, setClients] = useState(initialClients || []);

  // Sync state with props when server data changes
  useEffect(() => {
    setClients(initialClients || []);
  }, [initialClients]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [currentClient, setCurrentClient] = useState({
    id: null,
    textBeforeTooltip: "",
    textAfterTooltip: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentClient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        if (img.width === 512 && img.height === 512) {
          setSelectedFile(file);
          
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviewImage(e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          toast.error("Image must be 512x512 pixels");
        }
      };
    }
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const removeClient = async (clientId) => {
    if (!confirm("Are you sure you want to remove this client?")) {
      return;
    }

    try {
      setLoading(true);
      
      const updatedClients = clients.filter(client => client.id !== clientId);
      setClients(updatedClients);
      
      const result = await saveHeroData({ 
        clients: updatedClients,
        ...heroContent
      });
      
      if (result.success) {
        toast.success("Client removed successfully!");
        // Refresh the page to get updated data from server
        router.refresh();
      } else {
        setClients(clients);
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error removing client:", error);
      setClients(clients);
      toast.error("Error removing client");
    } finally {
      setLoading(false);
    }
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile) return null;

    try {
      const storageRef = ref(storage, `home/hero/clients/${Date.now()}_${selectedFile.name}`);
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading client image:", error);
      toast.error("Error uploading client image");
      return null;
    }
  };

  const startEditing = (client) => {
    setCurrentClient(client);
    setEditingClientId(client.id);
    setShowUploadForm(true);
  };

  const startNewClient = () => {
    setCurrentClient({
      id: null,
      textBeforeTooltip: "",
      textAfterTooltip: ""
    });
    setEditingClientId(null);
    setSelectedFile(null);
    setPreviewImage(null);
    setShowUploadForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageUrl = null;
      
      if (selectedFile) {
        imageUrl = await uploadSelectedFile();
        if (!imageUrl) {
          toast.error("Failed to upload image");
          setLoading(false);
          return;
        }
      }
      
      let updatedClients = [...clients];
      
      if (editingClientId) {
        updatedClients = updatedClients.map(client => 
          client.id === editingClientId 
            ? { 
                ...currentClient, 
                imageUrl: imageUrl || client.imageUrl 
              } 
            : client
        );
      } else {
        const newClient = {
          ...currentClient,
          id: Date.now().toString(),
          imageUrl: imageUrl
        };
        updatedClients = [...updatedClients, newClient];
      }
      
      const result = await saveHeroData({ 
        clients: updatedClients,
        ...heroContent
      });
      
      if (result.success) {
        toast.success(editingClientId ? "Client updated successfully!" : "Client added successfully!");
        setClients(updatedClients);
        setSelectedFile(null);
        setPreviewImage(null);
        setShowUploadForm(false);
        setCurrentClient({
          id: null,
          textBeforeTooltip: "",
          textAfterTooltip: ""
        });
        setEditingClientId(null);
        
        // Refresh the page to get updated data from server
        router.refresh();
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving hero section:", error);
      toast.error("Error saving client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Clients</h2>
        <button
          onClick={startNewClient}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Add New Client
        </button>
      </div>

      {!showUploadForm && (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            {clients.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {clients.map((client) => (
                  <div key={client.id} className="bg-gray-50 rounded-xl p-5 relative group">
                    <button
                      onClick={() => startEditing(client)}
                      className="absolute top-3 right-12 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit3 size={16} className="text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => removeClient(client.id)}
                      disabled={loading}
                      className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                    
                    {client.imageUrl ? (
                      <div className="aspect-square rounded-lg overflow-hidden bg-white border border-gray-200 mb-4">
                        <img 
                          src={client.imageUrl} 
                          alt="Client" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-200 border border-gray-300 mb-4 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Before Tooltip</p>
                        <p className="text-sm font-medium text-gray-800">
                          {client.textBeforeTooltip || "Not set"}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500 mb-1">After Tooltip</p>
                        <p className="text-sm font-medium text-gray-800">
                          {client.textAfterTooltip || "Not set"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No clients added yet</h3>
                <p className="text-gray-500 mb-6">Get started by adding a new client</p>
                <button
                  onClick={startNewClient}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg mx-auto"
                >
                  <Plus size={18} />
                  Add Your First Client
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showUploadForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingClientId ? "Edit Client" : "Add New Client"}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Tooltip Text</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text Before Tooltip
                      </label>
                      <input
                        type="text"
                        name="textBeforeTooltip"
                        value={currentClient.textBeforeTooltip}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        placeholder="Enter text before tooltip"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Text After Tooltip
                      </label>
                      <input
                        type="text"
                        name="textAfterTooltip"
                        value={currentClient.textAfterTooltip}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                        placeholder="Enter text after tooltip"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Client Image</h3>
                  <p className="text-sm text-gray-500 mb-4">Image dimensions must be 512x512 pixels</p>
                  
                  {previewImage ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img 
                            src={previewImage} 
                            alt="Preview" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={removeSelectedImage}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md hover:bg-red-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ) : editingClientId && currentClient.imageUrl ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img 
                            src={currentClient.imageUrl} 
                            alt="Current" 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => document.getElementById('client-image-upload').click()}
                          className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md hover:bg-blue-600"
                        >
                          <Upload size={18} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-gray-300 hover:border-orange-400"
                      onClick={() => document.getElementById('client-image-upload').click()}
                    >
                      <input
                        id="client-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        disabled={loading}
                        className="hidden"
                      />
                      
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-orange-100 p-3 rounded-full mb-4">
                          <Upload className="text-orange-600" size={24} />
                        </div>
                        <p className="text-gray-700 font-medium mb-1">
                          Upload client image
                        </p>
                        <p className="text-gray-500 text-sm">
                          Click to browse (512x512 required)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {editingClientId ? 'Update Client' : 'Add Client'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}

