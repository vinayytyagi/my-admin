import React from 'react';
import { Loader2, FolderX } from 'lucide-react';
import PortfolioCard from './PortfolioCard';

const PortfolioList = ({ portfolios, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600 text-center">Loading portfolio projects...</p>
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md border border-gray-100 my-6 text-center p-8">
        <div className="bg-blue-50 p-4 rounded-full mb-6">
          <FolderX size={64} className="text-blue-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No Projects Yet</h3>
        <p className="text-gray-600 max-w-md">
          You haven't created any portfolio projects yet. Use the "Create Project" button above to showcase your work.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
      {portfolios.map((portfolio) => (
        <PortfolioCard key={portfolio.id} portfolio={portfolio} />
      ))}
    </div>
  );
};

export default PortfolioList;