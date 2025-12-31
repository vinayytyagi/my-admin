"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ChevronDown,
  PlusCircle,
  X,
  Check,
  ListFilter,
  SortAsc,
} from "lucide-react";
import Link from "next/link";

const PortfolioFilters = ({
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  statusFilter,
  setStatusFilter,
}) => {
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const sortRef = useRef(null);
  const statusRef = useRef(null);

  const getSortDisplayText = () => {
    switch (sortOption) {
      case "recent":
        return "Recently Created";
      case "oldest":
        return "Oldest First";
      case "alphabetical":
        return "Alphabetical (A-Z)";
      default:
        return "Recently Created";
    }
  };

  const getStatusDisplayText = () => {
    switch (statusFilter) {
      case "all":
        return "All Projects";
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "draft":
        return "Draft";
      default:
        return "All Projects";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target)) {
        setIsStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-grow sm:max-w-[300px]">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by project title"
            className="pl-11 pr-9 py-3 border border-gray-200 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative" ref={sortRef}>
          <button
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm group"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
          >
            <SortAsc size={16} className="text-gray-500" />
            <span className="text-sm font-medium shrink-0 text-gray-700">
              {getSortDisplayText()}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                isSortDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isSortDropdownOpen && (
            <div className="absolute top-full mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-100 w-48 py-1">
              <button
                className={`w-full px-4 py-2 text-sm hover:bg-blue-50 flex items-center ${
                  sortOption === "recent"
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setSortOption("recent");
                  setIsSortDropdownOpen(false);
                }}
              >
                {sortOption === "recent" && (
                  <Check size={16} className="mr-2 flex-shrink-0" />
                )}
                <span className={sortOption === "recent" ? "flex-shrink-0" : "ml-0"}>
                  Recently Created
                </span>
              </button>
              <button
                className={`w-full px-4 py-2 text-sm hover:bg-blue-50 flex items-center ${
                  sortOption === "oldest"
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setSortOption("oldest");
                  setIsSortDropdownOpen(false);
                }}
              >
                {sortOption === "oldest" && (
                  <Check size={16} className="mr-2 flex-shrink-0" />
                )}
                <span className={sortOption === "oldest" ? "flex-shrink-0" : "ml-0"}>
                  Oldest First
                </span>
              </button>
              <button
                className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center ${
                  sortOption === "alphabetical"
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setSortOption("alphabetical");
                  setIsSortDropdownOpen(false);
                }}
              >
                {sortOption === "alphabetical" && (
                  <Check size={16} className="mr-2 flex-shrink-0" />
                )}
                <span
                  className={sortOption === "alphabetical" ? "flex-shrink-0" : "ml-0"}
                >
                  Alphabetical (A-Z)
                </span>
              </button>
            </div>
          )}
        </div>

        <div className="relative" ref={statusRef}>
          <button
            className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-full bg-white hover:bg-gray-50 transition-all shadow-sm group"
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
          >
            <ListFilter size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              {getStatusDisplayText()}
            </span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${
                isStatusDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isStatusDropdownOpen && (
            <div className="absolute top-full mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-100 w-48 py-1">
              <button
                className={`w-full px-4 py-2 text-sm hover:bg-blue-50 flex items-center ${
                  statusFilter === "all"
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setStatusFilter("all");
                  setIsStatusDropdownOpen(false);
                }}
              >
                {statusFilter === "all" && (
                  <Check size={16} className="mr-2 flex-shrink-0" />
                )}
                <span className={statusFilter === "all" ? "flex-shrink-0" : "ml-0"}>
                  All Projects
                </span>
              </button>
              <button
                className={`w-full px-4 py-2 text-sm hover:bg-blue-50 flex items-center ${
                  statusFilter === "completed"
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setStatusFilter("completed");
                  setIsStatusDropdownOpen(false);
                }}
              >
                {statusFilter === "completed" && (
                  <Check size={16} className="mr-2 flex-shrink-0" />
                )}
                <span className={statusFilter === "completed" ? "flex-shrink-0" : "ml-0"}>
                  Completed
                </span>
              </button>
              <button
                className={`w-full px-4 py-2 text-sm hover:bg-blue-50 flex items-center ${
                  statusFilter === "in-progress"
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setStatusFilter("in-progress");
                  setIsStatusDropdownOpen(false);
                }}
              >
                {statusFilter === "in-progress" && (
                  <Check size={16} className="mr-2 flex-shrink-0" />
                )}
                <span className={statusFilter === "in-progress" ? "flex-shrink-0" : "ml-0"}>
                  In Progress
                </span>
              </button>
              <button
                className={`w-full px-4 py-2 text-sm hover:bg-blue-50 flex items-center ${
                  statusFilter === "draft"
                    ? "text-blue-500 font-medium"
                    : "text-gray-700"
                }`}
                onClick={() => {
                  setStatusFilter("draft");
                  setIsStatusDropdownOpen(false);
                }}
              >
                {statusFilter === "draft" && (
                  <Check size={16} className="mr-2 flex-shrink-0" />
                )}
                <span className={statusFilter === "draft" ? "flex-shrink-0" : "ml-0"}>
                  Draft
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <Link
        href={"/portfolio/create-portfolio"}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-400 text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px] w-full sm:w-auto justify-center"
      >
        <PlusCircle size={18} className="stroke-[2.5px]" />
        <span className="text-sm font-medium">Create Project</span>
      </Link>
    </div>
  );
};

export default PortfolioFilters;