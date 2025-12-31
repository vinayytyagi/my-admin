"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Save, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ContactPage = () => {
  const [contactData, setContactData] = useState({
    heading: "Contact with me to sizzle your project",
    subheading: "Ready to bring your vision to life? Let's collaborate and create something amazing together.",
    quickCall: {
      title: "Quick Call",
      phone: "+1 (555) 123-4567"
    },
    emailUs: {
      title: "Email Us",
      email: "hello@company.com"
    },
    visitOffice: {
      title: "Visit Our Office",
      address: "123 Business Ave",
      city: "New York, NY 10001"
    }
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      setDataLoading(true);
      const response = await fetch('/api/home/contact');
      const data = await response.json();
      
      if (data.success && data.contact) {
        setContactData({
          heading: data.contact.heading || "Contact with me to sizzle your project",
          subheading: data.contact.subheading || "Ready to bring your vision to life? Let's collaborate and create something amazing together.",
          quickCall: data.contact.quickCall || {
            title: "Quick Call",
            phone: "+1 (555) 123-4567"
          },
          emailUs: data.contact.emailUs || {
            title: "Email Us",
            email: "hello@company.com"
          },
          visitOffice: data.contact.visitOffice || {
            title: "Visit Our Office",
            address: "123 Business Ave",
            city: "New York, NY 10001"
          }
        });
      }
    } catch (error) {
      console.error("Error fetching contact data:", error);
      toast.error("Error fetching contact data");
    } finally {
      setDataLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/home/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Contact section saved successfully!");
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving contact data:", error);
      toast.error("Error saving contact data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Section Management</h1>
          <p className="text-sm text-gray-600 mt-1">Manage contact section heading, subheading, and contact information</p>
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

      <div className="max-w-4xl mx-auto p-6">
        {dataLoading ? (
          <div className="flex items-center justify-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            {/* Section Heading */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Section Heading</h2>
              <div className="space-y-4">
                <div>
                  <Label>Heading</Label>
                  <Input
                    value={contactData.heading}
                    onChange={(e) => setContactData({ ...contactData, heading: e.target.value })}
                    placeholder="e.g., Contact with me to sizzle your project"
                  />
                </div>
                <div>
                  <Label>Subheading</Label>
                  <textarea
                    value={contactData.subheading}
                    onChange={(e) => setContactData({ ...contactData, subheading: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    rows={3}
                    placeholder="e.g., Ready to bring your vision to life? Let's collaborate and create something amazing together."
                  />
                </div>
              </div>
            </div>

            {/* Quick Call */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Quick Call</h2>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={contactData.quickCall.title}
                    onChange={(e) => setContactData({
                      ...contactData,
                      quickCall: { ...contactData.quickCall, title: e.target.value }
                    })}
                    placeholder="e.g., Quick Call"
                  />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={contactData.quickCall.phone}
                    onChange={(e) => setContactData({
                      ...contactData,
                      quickCall: { ...contactData.quickCall, phone: e.target.value }
                    })}
                    placeholder="e.g., +1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Email Us */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Email Us</h2>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={contactData.emailUs.title}
                    onChange={(e) => setContactData({
                      ...contactData,
                      emailUs: { ...contactData.emailUs, title: e.target.value }
                    })}
                    placeholder="e.g., Email Us"
                  />
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={contactData.emailUs.email}
                    onChange={(e) => setContactData({
                      ...contactData,
                      emailUs: { ...contactData.emailUs, email: e.target.value }
                    })}
                    placeholder="e.g., hello@company.com"
                  />
                </div>
              </div>
            </div>

            {/* Visit Our Office */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Visit Our Office</h2>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={contactData.visitOffice.title}
                    onChange={(e) => setContactData({
                      ...contactData,
                      visitOffice: { ...contactData.visitOffice, title: e.target.value }
                    })}
                    placeholder="e.g., Visit Our Office"
                  />
                </div>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={contactData.visitOffice.address}
                    onChange={(e) => setContactData({
                      ...contactData,
                      visitOffice: { ...contactData.visitOffice, address: e.target.value }
                    })}
                    placeholder="e.g., 123 Business Ave"
                  />
                </div>
                <div>
                  <Label>City & State</Label>
                  <Input
                    value={contactData.visitOffice.city}
                    onChange={(e) => setContactData({
                      ...contactData,
                      visitOffice: { ...contactData.visitOffice, city: e.target.value }
                    })}
                    placeholder="e.g., New York, NY 10001"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;

