"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IndiaPagesDashboard from "../_components/IndiaPagesDashboard";

export default function ServicesListPage() {
  const [activeTab, setActiveTab] = useState("india"); // default to India dashboard
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/test-pages/list", { cache: 'no-store' });
      const data = await res.json();
      if (res.ok) {
        setItems(Array.isArray(data.items) ? data.items : []);
      } else {
        setError(data?.error || "Failed to load");
      }
    } catch (e) {
      setError("Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      load();
    }
  }, [load, activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-800">📄 Service Pages</h1>
          <button
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all"
            onClick={() => {
              const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
              router.push(`/services/${encodeURIComponent(id)}`);
            }}
          >
            + Create New Page
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          <button
            onClick={() => setActiveTab("india")}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
              activeTab === "india"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🇮🇳 India Pages Dashboard
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📋 All Pages
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "india" ? (
        <IndiaPagesDashboard />
      ) : (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-slate-500">{items.length} pages total</div>
            <button onClick={load} className="px-3 py-1 rounded bg-gray-800 text-white text-sm" disabled={loading}>
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>
          {error ? <p className="text-red-500 text-sm mb-3">{error}</p> : null}
          <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2 w-16">#</th>
                  <th className="px-3 py-2">URL (pathKey)</th>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2 w-40">Sections</th>
                  <th className="px-3 py-2 w-48">Updated</th>
                  <th className="px-3 py-2 w-40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.pathKey} className="border-t hover:bg-slate-50">
                    <td className="px-3 py-2">{it.index}</td>
                    <td className="px-3 py-2 break-all font-mono text-xs">{it.pathKey}</td>
                    <td className="px-3 py-2">{it.title || '—'}</td>
                    <td className="px-3 py-2">{it.sectionsCount}</td>
                    <td className="px-3 py-2">{it.updatedAt ? new Date(it.updatedAt).toLocaleString() : "—"}</td>
                    <td className="px-3 py-2 flex items-center gap-3">
                      <Link href={`/services/${encodeURIComponent(it.id || it.pathKey)}`} className="text-blue-600 hover:underline">Open</Link>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => { setDeletingId(it.id); setConfirmText(""); }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-gray-500">No services yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-2">🗑️ Delete service</h2>
            <p className="text-sm text-gray-600 mb-4">Type <span className="font-mono font-semibold bg-red-50 px-1 rounded">confirm</span> to permanently delete this service.</p>
            <input
              autoFocus
              className="w-full border rounded-lg px-3 py-2 mb-4"
              placeholder="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                onClick={() => setDeletingId("")}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                disabled={confirmText.trim().toLowerCase() !== 'confirm'}
                onClick={async () => {
                  if (confirmText.trim().toLowerCase() !== 'confirm') return;
                  try {
                    const res = await fetch('/api/services/delete', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ id: deletingId })
                    });
                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) {
                      alert(data?.error || 'Failed to delete');
                    } else {
                      setDeletingId("");
                      setConfirmText("");
                      await load();
                    }
                  } catch (e) {
                    alert('Failed to delete');
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
