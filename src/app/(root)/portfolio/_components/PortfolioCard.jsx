import React, { useState } from 'react';
import { Eye, CalendarDays, Image as ImageIcon, ExternalLink, Github, User, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const PortfolioCard = ({ portfolio, onDelete }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getFirstImage = () => {
        // Use the main image if available, otherwise fall back to category images
        if (portfolio.image) return portfolio.image;
        
        if (!portfolio.categories) return null;

        for (const category of Object.values(portfolio.categories)) {
            if (category.images && category.images.length > 0) {
                return category.images[0].url;
            }
        }
        return null;
    };

    const getTechnologies = () => {
        if (!portfolio.categories) return [];

        const allTech = [];
        Object.values(portfolio.categories).forEach(category => {
            if (category.technologies) {
                allTech.push(...category.technologies);
            }
        });
        return [...new Set(allTech)].slice(0, 3); // Remove duplicates and limit to 3
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/portfolio/delete-portfolio/${portfolio.slug}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Portfolio deleted successfully');
                if (onDelete) {
                    onDelete(portfolio.slug);
                }
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete portfolio');
            }
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            toast.error(error.message || 'Failed to delete portfolio');
        } finally {
            setIsDeleting(false);
            router.refresh();
        }
    };

    const firstImage = getFirstImage();

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 group relative">
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-3 left-3 z-10 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete portfolio"
            >
                {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                    <Trash2 size={16} />
                )}
            </button>

            <Link href={`/portfolio/edit-portfolio/${portfolio?.slug}`}>
                <div className="h-full flex flex-col cursor-pointer">
                    <div className="w-full h-48 relative overflow-hidden">
                        {firstImage ? (
                            <Image
                                src={firstImage}
                                alt={portfolio.title}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                                <div className="flex flex-col items-center">
                                    <ImageIcon size={40} className="text-blue-300" />
                                    <span className="text-sm text-blue-400 mt-2">No preview</span>
                                </div>
                            </div>
                        )}

                        <div className="absolute top-3 right-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(portfolio.status)}`}>
                                {portfolio.status === 'in-progress' ? 'In Progress' :
                                    portfolio.status.charAt(0).toUpperCase() + portfolio.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col">
                        <div className="flex-grow">
                            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                {portfolio.title}
                            </h3>

                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                {portfolio.description}
                            </p>

                            {portfolio.client && (
                                <div className="flex items-center text-gray-500 mb-3">
                                    <User size={16} className="mr-2 text-blue-500" />
                                    <span className="text-sm">{portfolio.client}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 mb-4">
                            <div className="flex items-center justify-between text-gray-600">
                                {portfolio.createdAt && (
                                    <div className="flex items-center text-gray-600">
                                        <CalendarDays size={16} className="mr-2 text-blue-500" />
                                        <span className="text-sm">
                                            Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    {portfolio.projectUrl && (
                                        <a
                                            href={portfolio.projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                            <span className="text-xs text-gray-400">ID: {portfolio.id?.slice(0, 8)}...</span>
                            <div className="flex gap-1">
                                {Object.keys(portfolio.categories || {}).map((category, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                                    >
                                        {category}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PortfolioCard;