"use client";
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

import React, { useEffect, useState, useCallback } from 'react'
import SectionManager from './SectionManager'
import ImageUpload from '@/components/ui/ImageUpload'
import { useSearchParams } from 'next/navigation'
import { getSlugTemplateById } from '../_data/slugTemplates'
import { findCityBySlug } from '../_data/indiaLocations'

// AI Generate Button Component
const AIGenerateButton = ({ onClick, loading, disabled, size = 'default' }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={loading || disabled}
        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-all
            ${loading ? 'bg-purple-100 text-purple-400 cursor-wait' : 
              disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
              'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 shadow-sm hover:shadow'}
            ${size === 'small' ? 'px-1.5 py-0.5' : ''}`}
        title={disabled ? 'Add template & city to enable AI' : 'Generate with AI'}
    >
        {loading ? (
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
            </svg>
        )}
        <span>{loading ? 'Generating...' : '✨ AI'}</span>
    </button>
);

const TabsClient = ({ seo, setSeo, sections, setSections }) => {
    const [keywordsRaw, setKeywordsRaw] = useState(Array.isArray(seo?.keywords) ? seo.keywords.join(', ') : '');
    const [loadingField, setLoadingField] = useState(null);
    const [aiError, setAiError] = useState('');
    
    const searchParams = useSearchParams();
    const templateId = searchParams?.get('template') || '';
    const citySlug = searchParams?.get('city') || '';
    
    // Get service and city names for AI context
    const template = templateId ? getSlugTemplateById(templateId) : null;
    const cityData = citySlug ? findCityBySlug(citySlug) : null;
    const serviceName = template?.label?.replace(/^[^\s]+\s/, '') || 'Software Development';
    const cityName = cityData?.name || citySlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'India';
    
    const canUseAI = !!(templateId && citySlug);

    useEffect(() => {
        const joined = Array.isArray(seo?.keywords) ? seo.keywords.join(', ') : '';
        setKeywordsRaw(joined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Array.isArray(seo?.keywords) ? seo.keywords.join('|') : '']);
    
    // AI Generation function
    const generateWithAI = useCallback(async (type) => {
        if (!canUseAI) return;
        
        setLoadingField(type);
        setAiError('');
        
        try {
            const response = await fetch('/api/ai-generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type,
                    service: serviceName,
                    city: cityName,
                    templateId,
                    currentContent: type === 'seo_title' ? seo?.title : 
                                   type === 'seo_description' ? seo?.description : '',
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'AI generation failed');
            }
            
            // Update the appropriate field
            switch (type) {
                case 'seo_title':
                    setSeo(p => ({ ...p, title: data.content }));
                    break;
                case 'seo_description':
                    setSeo(p => ({ ...p, description: data.content }));
                    break;
                case 'seo_keywords':
                    const keywords = Array.isArray(data.content) ? data.content : [];
                    setSeo(p => ({ ...p, keywords }));
                    setKeywordsRaw(keywords.join(', '));
                    break;
            }
        } catch (error) {
            console.error('[AI Generate Error]', error);
            setAiError(error.message);
        } finally {
            setLoadingField(null);
        }
    }, [canUseAI, serviceName, cityName, templateId, seo, setSeo]);
    
    return (
        <div className="h-full bg-white border-l py-4 overflow-hidden">
            <Tabs defaultValue="sections">
                <TabsList className="w-11/12 mx-auto flex items-center bg-slate-100 rounded justify-center">
                    <TabsTrigger className="flex-1 rounded" value="sections">Sections</TabsTrigger>
                    <TabsTrigger className="flex-1 rounded" value="seo">SEO</TabsTrigger>
                </TabsList>
                <TabsContent value="sections" className="mt-0 h-full">
                    <SectionManager sections={sections} setSections={setSections} />
                </TabsContent>
                <TabsContent value="seo">
                    <Card className="border-none shadow-none">
                        <CardContent className="grid gap-4">
                            {/* AI Status Banner */}
                            {!canUseAI && (
                                <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                                    💡 AI generation available when creating from Dashboard (needs template & city context)
                                </div>
                            )}
                            {aiError && (
                                <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
                                    ❌ {aiError}
                                </div>
                            )}
                            
                            {/* Page Title */}
                            <div className="grid gap-1">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="page-title">Page title</Label>
                                    <AIGenerateButton 
                                        onClick={() => generateWithAI('seo_title')}
                                        loading={loadingField === 'seo_title'}
                                        disabled={!canUseAI}
                                    />
                                </div>
                                <Input 
                                    id="page-title" 
                                    value={seo?.title || ''} 
                                    onChange={(e) => setSeo((p) => ({ ...p, title: e.target.value }))}
                                    placeholder="SEO meta title"
                                />
                            </div>
                            
                            {/* Description */}
                            <div className="grid gap-1">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="page-description">Description</Label>
                                    <AIGenerateButton 
                                        onClick={() => generateWithAI('seo_description')}
                                        loading={loadingField === 'seo_description'}
                                        disabled={!canUseAI}
                                    />
                                </div>
                                <textarea
                                    id="page-description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={seo?.description || ''}
                                    onChange={(e) => setSeo((p) => ({ ...p, description: e.target.value }))}
                                    placeholder="SEO meta description (150-160 characters recommended)"
                                />
                                <div className="text-xs text-slate-400 text-right">
                                    {seo?.description?.length || 0}/160 characters
                                </div>
                            </div>
                            
                            {/* OG Image */}
                            <div className="grid gap-1">
                                <ImageUpload
                                  label="Open Graph image"
                                  value={seo?.ogImageUrl || ''}
                                  onChange={(url) => setSeo((p) => ({ ...p, ogImageUrl: url }))}
                                  folder="seo"
                                />
                            </div>
                            
                            {/* Keywords */}
                            <div className="grid gap-1">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="seo-keywords">Keywords (comma or space separated)</Label>
                                    <AIGenerateButton 
                                        onClick={() => generateWithAI('seo_keywords')}
                                        loading={loadingField === 'seo_keywords'}
                                        disabled={!canUseAI}
                                    />
                                </div>
                                <textarea
                                    id="seo-keywords"
                                    className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={keywordsRaw}
                                    onChange={(e) => setKeywordsRaw(e.target.value)}
                                    onBlur={() => {
                                        const parts = keywordsRaw.split(/[\s,]+/).map(s => s.trim()).filter(Boolean);
                                        setSeo((p) => ({ ...p, keywords: parts }));
                                    }}
                                    placeholder="e.g., mobile app development, flutter app, react native"
                                />
                                <div className="text-xs text-slate-400">
                                    {seo?.keywords?.length || 0} keywords
                                </div>
                            </div>
                            
                            {/* Meta Robots */}
                            <div className="grid gap-1">
                                <Label htmlFor="seo-robots">Meta robots</Label>
                                <Input id="seo-robots" value={seo?.metaRobots || ''} onChange={(e) => setSeo((p) => ({ ...p, metaRobots: e.target.value }))} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default TabsClient