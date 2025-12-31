"use client";
import React, { useState, useEffect } from "react";
import { storage } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "react-hot-toast";
import { Upload, X, Save, Plus, Edit3, Trash2, Loader2 } from 'lucide-react';

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [currentClient, setCurrentClient] = useState({
    id: null
  });

  // Load existing data
  useEffect(() => {
    fetchClientData();
  }, []);

  const fetchClientData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch('/api/home/feature');
      const data = await response.json();
      
      if (data.success && data.feature) {
        setClients(data.feature.clients || []);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
      toast.error("Error fetching client data");
    } finally {
      setDataLoading(false);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Accept any image size
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const removeClient = async (clientId) => {
    if (!confirm("Are you sure you want to remove this client image?")) {
      return;
    }

    try {
      setLoading(true);
      
      // Remove client from local state first
      const updatedClients = clients.filter(client => client.id !== clientId);
      setClients(updatedClients);
      
      // Save updated clients list to backend
      const response = await fetch('/api/home/feature', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clients: updatedClients }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Client image removed successfully!");
      } else {
        // Revert local state if backend update fails
        setClients(clients);
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error removing client:", error);
      // Revert local state if backend update fails
      setClients(clients);
      toast.error("Error removing client image");
    } finally {
      setLoading(false);
    }
  };

  const uploadSelectedFile = async () => {
    if (!selectedFile) return null;

    try {
      const storageRef = ref(storage, `home/client/clients/${Date.now()}_${selectedFile.name}`);
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
      id: null
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
      
      // Upload selected file if exists
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
        // Update existing client
        updatedClients = updatedClients.map(client => 
          client.id === editingClientId 
            ? { 
                ...currentClient, 
                imageUrl: imageUrl || client.imageUrl 
              } 
            : client
        );
      } else {
        // Add new client
        const newClient = {
          ...currentClient,
          id: Date.now().toString(),
          imageUrl: imageUrl
        };
        updatedClients = [...updatedClients, newClient];
      }
      
      // Save to API
      const response = await fetch('/api/home/feature', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clients: updatedClients }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(editingClientId ? "Client updated successfully!" : "Client added successfully!");
        setClients(updatedClients);
        // Reset form
        setSelectedFile(null);
        setPreviewImage(null);
        setShowUploadForm(false);
        setCurrentClient({
          id: null
        });
        setEditingClientId(null);
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving client section:", error);
      toast.error("Error saving client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Client Section Management
          </h1>
          <p className="text-gray-600">
            Manage your website's client section content (Our Clients carousel)
          </p>
        </div>

        {/* Header with Add New Button */}
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

        {/* Loader while fetching data */}
        {dataLoading ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
              <p className="text-gray-600">Loading clients...</p>
            </div>
          </div>
        ) : (
          // Saved Content Display (Hidden when adding new)
          !showUploadForm && (
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
          )
        )}

        {/* Upload Form (Hidden by default) */}
        {showUploadForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingClientId ? "Edit Client" : "Add New Client"}
              </h2>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Client Image</h3>
                <p className="text-sm text-gray-500 mb-4">Upload client logo (any size accepted)</p>
                
                {/* Show preview when image is selected */}
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
                  // Show upload section when no image is selected
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
                        Click to browse
                      </p>
                    </div>
                  </div>
                )}
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
      </div>
    </div>
  );
};

export default ClientPage;
