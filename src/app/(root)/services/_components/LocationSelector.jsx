"use client";
import React, { useState, useMemo } from 'react';
import { INDIA_LOCATIONS, getAllDistricts, getCitiesForDistrict } from '../_data/indiaLocations';
import { SLUG_TEMPLATES, generateSlug, generateFullPath, getAllCategories, getSlugTemplatesByCategory } from '../_data/slugTemplates';

/**
 * LocationSelector Component
 * Hierarchical selector: District → City → Slug Template
 * Provides step-by-step guided selection for operations manager
 */
const LocationSelector = ({ 
  onSelect, 
  currentPath = { district: '', city: '', slug: '' },
  showPreview = true 
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState(currentPath.district || '');
  const [selectedCity, setSelectedCity] = useState(currentPath.city || '');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const districts = useMemo(() => getAllDistricts(), []);
  const cities = useMemo(() => getCitiesForDistrict(selectedDistrict), [selectedDistrict]);
  
  const selectedCityData = useMemo(() => 
    cities.find(c => c.slug === selectedCity), 
    [cities, selectedCity]
  );

  const handleDistrictChange = (districtKey) => {
    setSelectedDistrict(districtKey);
    setSelectedCity('');
    setSelectedTemplate('');
  };

  const handleCityChange = (citySlug) => {
    setSelectedCity(citySlug);
    setSelectedTemplate('');
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    
    if (selectedDistrict && selectedCity && templateId) {
      const district = INDIA_LOCATIONS[selectedDistrict];
      const slug = generateSlug(templateId, selectedCity);
      
      onSelect?.({
        district: district.slug,
        city: selectedCity,
        slug: slug,
        templateId: templateId,
        fullPath: generateFullPath(district.slug, selectedCity, templateId),
        cityName: selectedCityData?.name || selectedCity
      });
    }
  };

  const getStepStatus = (step) => {
    switch(step) {
      case 1: return selectedDistrict ? 'complete' : 'current';
      case 2: return selectedCity ? 'complete' : (selectedDistrict ? 'current' : 'pending');
      case 3: return selectedTemplate ? 'complete' : (selectedCity ? 'current' : 'pending');
      default: return 'pending';
    }
  };

  const StepIndicator = ({ step, label, status }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
      status === 'complete' ? 'bg-green-100 text-green-800' :
      status === 'current' ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-400' :
      'bg-gray-100 text-gray-400'
    }`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
        status === 'complete' ? 'bg-green-500 text-white' :
        status === 'current' ? 'bg-blue-500 text-white' :
        'bg-gray-300 text-gray-500'
      }`}>
        {status === 'complete' ? '✓' : step}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-4 space-y-4">
      {/* Progress Steps */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <StepIndicator step={1} label="District" status={getStepStatus(1)} />
        <span className="text-gray-300">→</span>
        <StepIndicator step={2} label="City" status={getStepStatus(2)} />
        <span className="text-gray-300">→</span>
        <StepIndicator step={3} label="Service" status={getStepStatus(3)} />
      </div>

      {/* Step 1: District Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          📍 Select District/Region
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {districts.map((district) => (
            <button
              key={district.key}
              onClick={() => handleDistrictChange(district.key)}
              className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                selectedDistrict === district.key
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="font-medium text-sm">{district.name}</div>
              <div className="text-xs text-slate-500">{district.cities.length} cities</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: City Selection */}
      {selectedDistrict && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-semibold text-slate-700">
            🏙️ Select City
          </label>
          <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg bg-white">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-2">
              {cities.map((city) => (
                <button
                  key={city.slug}
                  onClick={() => handleCityChange(city.slug)}
                  className={`px-3 py-2 rounded-md text-sm text-left transition-all ${
                    selectedCity === city.slug
                      ? 'bg-blue-500 text-white font-medium'
                      : 'bg-slate-50 hover:bg-blue-100 text-slate-700'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Slug Template Selection (Grouped by Category) */}
      {selectedCity && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-semibold text-slate-700">
            🎯 Select Service Type
          </label>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {getAllCategories().map(category => (
              <div key={category} className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-100 text-sm font-semibold text-slate-700 border-b border-slate-200">
                  {category}
                </div>
                <div className="grid grid-cols-1 gap-1 p-2">
                  {getSlugTemplatesByCategory(category).map(template => (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id)}
                      className={`p-2 rounded-lg border text-left transition-all hover:shadow-sm ${
                        selectedTemplate === template.id
                          ? 'border-green-500 bg-green-50 shadow-md'
                          : 'border-slate-100 bg-white hover:border-green-300 hover:bg-green-50/50'
                      }`}
                    >
                      <div className="font-medium text-sm">{template.label}</div>
                      <div className="text-xs text-slate-500 font-mono truncate">
                        /{INDIA_LOCATIONS[selectedDistrict]?.slug}/{selectedCity}/{template.template.replace('{city}', selectedCity)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      {showPreview && selectedDistrict && selectedCity && selectedTemplate && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg animate-in fade-in duration-300">
          <div className="text-xs font-semibold text-green-700 mb-1">✅ Generated Path:</div>
          <div className="font-mono text-sm text-green-800 break-all">
            /{generateFullPath(INDIA_LOCATIONS[selectedDistrict]?.slug, selectedCity, selectedTemplate)}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
