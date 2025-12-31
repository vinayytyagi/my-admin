"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Eye } from "lucide-react"; // yarn add lucide-react
import { Loader } from "lucide-react";   // already using lucide; no extra dep.

export default function RequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalReq, setModalReq] = useState(null);

  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [reqFilter, setReqFilter] = useState("all");
  const [budgetFilter, setBudgetFilter] = useState("all");

  // ──────────────────────────────── fetch data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/requests/get-requests");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to fetch requests");

        const formatted = data.requests.map((r) => {
          let createdAtISO = new Date().toISOString();
          try {
            if (r.createdAt?.seconds)
              createdAtISO = new Date(r.createdAt.seconds * 1000).toISOString();
            else if (typeof r.createdAt === "string" || typeof r.createdAt === "number")
              createdAtISO = new Date(r.createdAt).toISOString();
          } catch {}
          return { ...r, createdAt: createdAtISO };
        });
        setRequests(formatted);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching requests");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ──────────────────────────────── requirement dropdown
  const requirementOptions = useMemo(() => {
    const set = new Set(requests.map((r) => r.requirement).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [requests]);

  // ──────────────────────────────── filtering + sorting
  const filtered = useMemo(() => {
    let list = [...requests];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.phone?.includes(q) ||
          r.requirement?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) // include description
      );
    }

    if (reqFilter !== "all") list = list.filter((r) => r.requirement === reqFilter);

    if (budgetFilter === "invalid")
      list = list.filter((r) => Number(r.budget) <= 0 || isNaN(r.budget));
    if (budgetFilter === "valid")
      list = list.filter((r) => Number(r.budget) > 0);

    list.sort((a, b) =>
      sortOption === "oldest"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

    return list;
  }, [requests, searchQuery, sortOption, reqFilter, budgetFilter]);

  // ──────────────────────────────── modal
 const RequestModal = ({ req, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  // When `req` changes (modal opens), start a tiny timeout to let
  // the browser render -> avoids perceived jank on big payloads.
  useEffect(() => {
    if (req) {
      const id = setTimeout(() => setIsLoading(false), 200); // 200 ms loader
      return () => clearTimeout(id);
    }
    setIsLoading(true);
  }, [req]);

  if (!req) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 md:p-8">
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-lg shadow-lg relative">
        {/* close btn */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl leading-none"
          aria-label="Close"
        >
          ✕
        </button>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-10">
            <Loader className="animate-spin h-8 w-8 text-gray-600 mb-2" />
            <p className="text-sm text-gray-600">Loading…</p>
          </div>
        ) : (
          <>
            {/* header */}
            <h2 className="text-xl font-semibold px-6 pt-6 pb-4 break-words">
              {req.name || "Untitled Request"}
            </h2>

            {/* body */}
            <div className="px-6 pb-6 max-h-[70vh] overflow-y-auto text-sm space-y-3">
              <p><strong>Email:</strong> {req.email || "—"}</p>
              <p><strong>Phone:</strong> {req.phone || "—"}</p>
              <p><strong>Requirement:</strong> {req.requirement || "—"}</p>
              <p><strong>Budget:</strong> {req.budget ?? "—"}</p>
              <p><strong>Date:</strong> {new Date(req.createdAt).toLocaleString()}</p>

              <div>
                <p className="font-semibold">Description:</p>
                <pre className="whitespace-pre-wrap break-words bg-gray-50 rounded-md p-3 mt-1">
{req.description || "—"}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

  // ──────────────────────────────── UI
  return (
    <div className="min-h-screen bg-[#f9fafb] p-6 md:p-8">
      <h1 className="text-2xl font-bold mb-6">Requests ({filtered.length})</h1>

      {/* filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name / email / phone / description"
          className="border px-3 py-2 rounded-md w-full md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="border px-3 py-2 rounded-md w-full md:w-auto"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest First</option>
        </select>

        <select
          className="border px-3 py-2 rounded-md w-full md:w-auto"
          value={reqFilter}
          onChange={(e) => setReqFilter(e.target.value)}
        >
          {requirementOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "all" ? "All Requirements" : opt}
            </option>
          ))}
        </select>

        <select
          className="border px-3 py-2 rounded-md w-full md:w-auto"
          value={budgetFilter}
          onChange={(e) => setBudgetFilter(e.target.value)}
        >
          <option value="all">All Budgets</option>
          <option value="valid">Budget &gt; 0</option>
          <option value="invalid">Invalid / Missing</option>
        </select>
      </div>

      {/* table */}
      {loading ? (
        <p>Loading requests…</p>
      ) : filtered.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100 whitespace-nowrap">
              <tr>
                <th className="p-2 border text-left">#</th>
                <th className="p-2 border text-left">Name</th>
                <th className="p-2 border text-left">Email</th>
                <th className="p-2 border text-left">Phone</th>
                <th className="p-2 border text-left">Requirement</th>
                <th className="p-2 border text-left">Description</th>
                <th className="p-2 border text-left">Budget</th>
                <th className="p-2 border text-left">Date</th>
                <th className="p-2 border text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={r.id || idx} className="hover:bg-gray-50 text-sm">
                  <td className="p-2 border">{idx + 1}</td>
                  <td className="p-2 border">{r.name || "—"}</td>
                  <td className="p-2 border">{r.email || "—"}</td>
                  <td className="p-2 border">{r.phone || "—"}</td>
                  <td className="p-2 border">{r.requirement || "—"}</td>
                  <td className="p-2 border truncate max-w-[10rem]">
                    {r.description || "—"}
                  </td>
                  <td className="p-2 border">{r.budget || "—"}</td>
                  <td className="p-2 border">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => setModalReq(r)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View full details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* modal */}
      <RequestModal req={modalReq} onClose={() => setModalReq(null)} />
    </div>
  );
}
