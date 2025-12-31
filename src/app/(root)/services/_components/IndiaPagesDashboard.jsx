"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { INDIA_LOCATIONS, getAllDistricts, getCitiesForDistrict } from '../_data/indiaLocations';
import { SLUG_TEMPLATES, generateFullPath, generateSeoForPage, getAllCategories, getSlugTemplatesByCategory } from '../_data/slugTemplates';

/**
 * IndiaPagesDashboard Component
 * Matrix view showing Cities × Services with completion tracking
 * Enables bulk operations and progress monitoring
 */
const IndiaPagesDashboard = () => {
  const router = useRouter();
  const [selectedDistrict, setSelectedDistrict] = useState('delhi-ncr');
  const [selectedCategory, setSelectedCategory] = useState(''); // Empty means show all
  const [existingPages, setExistingPages] = useState({});
  const [loading, setLoading] = useState(true);
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [creating, setCreating] = useState(false);

  const districts = useMemo(() => getAllDistricts(), []);
  const cities = useMemo(() => getCitiesForDistrict(selectedDistrict), [selectedDistrict]);
  const districtData = INDIA_LOCATIONS[selectedDistrict];
  const categories = useMemo(() => getAllCategories(), []);
  
  // Filter templates by category
  const filteredTemplates = useMemo(() => {
    if (!selectedCategory) return SLUG_TEMPLATES;
    return getSlugTemplatesByCategory(selectedCategory);
  }, [selectedCategory]);

  // Load existing pages
  const loadExistingPages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test-pages/list', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && Array.isArray(data.items)) {
        const pageMap = {};
        data.items.forEach(item => {
          if (item.pathKey) {
            pageMap[item.pathKey] = item;
          }
        });
        setExistingPages(pageMap);
      }
    } catch (e) {
      console.error('Failed to load pages', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExistingPages();
  }, [loadExistingPages]);

  // Check if a page exists
  const pageExists = useCallback((citySlug, templateId) => {
    const path = generateFullPath(districtData?.slug, citySlug, templateId);
    return !!existingPages[path];
  }, [existingPages, districtData]);

  // Calculate stats (for filtered templates)
  const stats = useMemo(() => {
    if (!districtData) return { total: 0, created: 0, missing: 0, allTotal: 0, allCreated: 0 };
    
    // Stats for filtered view
    const total = cities.length * filteredTemplates.length;
    let created = 0;
    cities.forEach(city => {
      filteredTemplates.forEach(template => {
        if (pageExists(city.slug, template.id)) created++;
      });
    });
    
    // Stats for all templates
    const allTotal = cities.length * SLUG_TEMPLATES.length;
    let allCreated = 0;
    cities.forEach(city => {
      SLUG_TEMPLATES.forEach(template => {
        if (pageExists(city.slug, template.id)) allCreated++;
      });
    });
    
    return { total, created, missing: total - created, allTotal, allCreated };
  }, [cities, districtData, pageExists, filteredTemplates]);

  // Toggle cell selection
  const toggleCell = (citySlug, templateId) => {
    const key = `${citySlug}:${templateId}`;
    const newSet = new Set(selectedCells);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setSelectedCells(newSet);
  };

  // Select all missing for a city (in current filtered view)
  const selectAllMissingForCity = (citySlug) => {
    const newSet = new Set(selectedCells);
    filteredTemplates.forEach(template => {
      if (!pageExists(citySlug, template.id)) {
        newSet.add(`${citySlug}:${template.id}`);
      }
    });
    setSelectedCells(newSet);
  };

  // Select all missing for a template
  const selectAllMissingForTemplate = (templateId) => {
    const newSet = new Set(selectedCells);
    cities.forEach(city => {
      if (!pageExists(city.slug, templateId)) {
        newSet.add(`${city.slug}:${templateId}`);
      }
    });
    setSelectedCells(newSet);
  };

  // Open single page editor
  const openPageEditor = (citySlug, templateId) => {
    const path = generateFullPath(districtData?.slug, citySlug, templateId);
    router.push(`/services/new?pathKey=${encodeURIComponent(path)}&template=${templateId}&city=${citySlug}`);
  };

  // Bulk create selected pages
  const bulkCreatePages = async () => {
    if (selectedCells.size === 0) return;
    setCreating(true);
    
    try {
      for (const key of selectedCells) {
        const [citySlug, templateId] = key.split(':');
        const city = cities.find(c => c.slug === citySlug);
        if (!city) continue;
        
        const path = generateFullPath(districtData?.slug, citySlug, templateId);
        const seo = generateSeoForPage(templateId, city.name, citySlug);
        
        // Create page with default sections
        await fetch('/api/test-pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pathKey: path,
            sections: [
              {
                id: `hero-${Date.now()}`,
                type: 'hero',
                visible: true,
                order: 0,
                props: {
                  headline: seo.title.replace(' | Xenotix', ''),
                  subheadline: seo.description,
                }
              }
            ]
          })
        });
        
        // Create SEO
        await fetch('/api/test-seo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pathKey: path,
            seo: seo
          })
        });
      }
      
      setSelectedCells(new Set());
      setBulkMode(false);
      await loadExistingPages();
    } catch (e) {
      console.error('Bulk create failed', e);
      alert('Some pages failed to create. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">🇮🇳 India Pages Dashboard</h2>
          <p className="text-sm text-slate-500">Manage location-based service pages efficiently</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadExistingPages}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium"
            disabled={loading}
          >
            {loading ? '⟳ Loading...' : '🔄 Refresh'}
          </button>
          <button
            onClick={() => { setBulkMode(!bulkMode); setSelectedCells(new Set()); }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              bulkMode ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {bulkMode ? '✕ Cancel Bulk' : '⚡ Bulk Mode'}
          </button>
        </div>
      </div>

      {/* District Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {districts.map(d => (
          <button
            key={d.key}
            onClick={() => { setSelectedDistrict(d.key); setSelectedCells(new Set()); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedDistrict === d.key
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white border border-slate-200 hover:border-blue-300'
            }`}
          >
            {d.name}
            <span className="ml-1 text-xs opacity-70">({d.cities.length})</span>
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-slate-500 self-center mr-2">Filter by:</span>
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedCategory === ''
              ? 'bg-purple-500 text-white shadow'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Services ({SLUG_TEMPLATES.length})
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setSelectedCells(new Set()); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-purple-500 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat} ({getSlugTemplatesByCategory(cat).length})
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold text-blue-800">{stats.created}</span>
            <span className="text-slate-500">/</span>
            <span className="text-lg text-slate-600">{stats.total}</span>
            <span className="text-sm text-slate-500">
              {selectedCategory ? `${selectedCategory} pages` : 'pages'} created
            </span>
            {selectedCategory && (
              <span className="text-xs text-slate-400 ml-2">
                (Overall: {stats.allCreated}/{stats.allTotal})
              </span>
            )}
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${stats.total ? (stats.created / stats.total * 100) : 0}%` }}
            />
          </div>
        </div>
        <div className="text-center px-4 border-l border-slate-200">
          <div className="text-2xl font-bold text-orange-600">{stats.missing}</div>
          <div className="text-xs text-slate-500">Missing</div>
        </div>
        {bulkMode && selectedCells.size > 0 && (
          <button
            onClick={bulkCreatePages}
            disabled={creating}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm disabled:opacity-50"
          >
            {creating ? '⟳ Creating...' : `✨ Create ${selectedCells.size} Pages`}
          </button>
        )}
      </div>

      {/* Matrix Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 sticky top-0">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 sticky left-0 bg-slate-50 z-10 min-w-[140px]">
                  City
                </th>
                {filteredTemplates.map(template => (
                  <th 
                    key={template.id} 
                    className="px-2 py-3 text-center text-xs font-semibold text-slate-600 min-w-[100px] cursor-pointer hover:bg-slate-100"
                    onClick={() => bulkMode && selectAllMissingForTemplate(template.id)}
                    title={bulkMode ? 'Click to select all missing' : template.label}
                  >
                    <div className="truncate">{template.label.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">
                      {template.label.split(' ').slice(1).join(' ')}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cities.map((city, idx) => (
                <tr key={city.slug} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td 
                    className="px-3 py-2 font-medium text-sm text-slate-700 sticky left-0 bg-inherit cursor-pointer hover:bg-blue-50"
                    onClick={() => bulkMode && selectAllMissingForCity(city.slug)}
                    title={bulkMode ? 'Click to select all missing for this city' : city.name}
                  >
                    {city.name}
                  </td>
                  {filteredTemplates.map(template => {
                    const exists = pageExists(city.slug, template.id);
                    const cellKey = `${city.slug}:${template.id}`;
                    const isSelected = selectedCells.has(cellKey);
                    
                    return (
                      <td key={template.id} className="px-2 py-2 text-center">
                        <button
                          onClick={() => {
                            if (bulkMode && !exists) {
                              toggleCell(city.slug, template.id);
                            } else if (!bulkMode) {
                              if (exists) {
                                const path = generateFullPath(districtData?.slug, city.slug, template.id);
                                const page = existingPages[path];
                                if (page?.id) {
                                  router.push(`/services/${encodeURIComponent(page.id)}`);
                                }
                              } else {
                                openPageEditor(city.slug, template.id);
                              }
                            }
                          }}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                            exists
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : isSelected
                                ? 'bg-orange-500 text-white ring-2 ring-orange-300'
                                : 'bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-600'
                          }`}
                          title={exists ? 'Page exists - Click to edit' : 'Click to create'}
                        >
                          {exists ? '✓' : isSelected ? '•' : '+'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center text-green-600 text-xs">✓</div>
          <span>Page exists</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-400 text-xs">+</div>
          <span>Missing (click to create)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white text-xs">•</div>
          <span>Selected for bulk create</span>
        </div>
      </div>
    </div>
  );
};

export default IndiaPagesDashboard;
