"use client";
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import PortfolioHeader from "./_components/PortfolioHeader";
import PortfolioFilters from "./_components/PortfolioFilters";
import PortfolioList from "./_components/PortfolioList";

const PortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();

        if (statusFilter !== "all") {
          queryParams.set("status", statusFilter);
        }

        if (searchQuery.trim()) {
          queryParams.set("title", searchQuery.trim());
        }

        if (sortOption === "oldest") {
          queryParams.set("order", "oldest");
        } else if (sortOption === "alphabetical") {
          queryParams.set("order", "a-z");
        } else {
          queryParams.set("order", "recent");
        }

        const res = await fetch(`/api/portfolio/get-portfolios?${queryParams.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Failed to fetch portfolios");
        }

        const formattedPortfolios = data.portfolios.map((portfolio) => {
          let createdAtISO = new Date().toISOString();

          try {
            if (portfolio.createdAt?.seconds) {
              createdAtISO = new Date(portfolio.createdAt.seconds * 1000).toISOString();
            } else if (typeof portfolio.createdAt === "string") {
              createdAtISO = new Date(portfolio.createdAt).toISOString();
            }
          } catch (error) {
            console.warn("Invalid createdAt value:", portfolio.createdAt);
          }

          return {
            ...portfolio,
            createdAt: createdAtISO,
          };
        });

        setPortfolios(formattedPortfolios);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching portfolios:", error);
        toast.error("Error fetching portfolios: " + error.message);
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [searchQuery, statusFilter, sortOption]);

  const filteredPortfolios = useMemo(() => portfolios, [portfolios]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 md:p-8">
      <PortfolioHeader portfoliosCount={portfolios.length} />
      <PortfolioFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortOption={sortOption}
        setSortOption={setSortOption}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <PortfolioList portfolios={filteredPortfolios} loading={loading} />
    </div>
  );
};

export default PortfolioPage;