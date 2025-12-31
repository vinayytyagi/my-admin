"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ActionBar from './ActionBar'
import TabsClient from './Tabs'
import SectionPreview from './SectionPreview'
import { generateSeoForPage, getSlugTemplateById } from '../_data/slugTemplates'
import { findCityBySlug, INDIA_LOCATIONS } from '../_data/indiaLocations'

const Client = ({ defaultPathKey, defaultId }) => {
    const [slug1, setSlug1] = useState("");
    const [slug2, setSlug2] = useState("");
    const [slug3, setSlug3] = useState("");
    const pathKey = useMemo(() => [slug1, slug2, slug3].filter(Boolean).join("/"), [slug1, slug2, slug3]);

    const [seo, setSeo] = useState({ title: "", description: "", keywords: [], ogImageUrl: "", metaRobots: "" });
    const [preview, setPreview] = useState({
        leftBadgeText: "",
        headline: "",
        subheadline: "",
        ctaLabel: "",
        statTitle: "",
        statSubtitle: "",
        reviewSource: "",
        reviewCount: "",
        topLeftImage: "",
        bottomBgImage: "",
    });
    const [sections, setSections] = useState([]);
    const [docId, setDocId] = useState(defaultId || "");
    const router = useRouter();
    const [saveError, setSaveError] = useState("");
    const [saveOk, setSaveOk] = useState(false);
    const [loading, setLoading] = useState(false);
    const [autoGenerating, setAutoGenerating] = useState(false);
    
    const searchParams = useSearchParams();
    const templateId = searchParams?.get('template') || '';
    const citySlug = searchParams?.get('city') || '';
    const template = templateId ? getSlugTemplateById(templateId) : null;
    const cityData = citySlug ? findCityBySlug(citySlug) : null;
    const serviceName = template?.label?.replace(/^[^\s]+\s/, '') || 'Technology Services';
    const cityName = cityData?.name || citySlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'India';
    const canAutoGenerate = !!(templateId && citySlug);

    // Auto-generate entire page with AI
    const handleAutoGenerate = useCallback(async () => {
        if (!canAutoGenerate) return;
        
        setAutoGenerating(true);
        setSaveError("");
        
        try {
            const response = await fetch('/api/auto-generate-page', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service: serviceName,
                    city: cityName,
                    templateId,
                }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Auto-generation failed');
            }
            
            if (data.pageData) {
                // Update SEO
                if (data.pageData.seo) {
                    setSeo(data.pageData.seo);
                }
                // Update sections
                if (data.pageData.sections) {
                    setSections(data.pageData.sections);
                }
            }
        } catch (error) {
            console.error('[Auto Generate Error]', error);
            setSaveError(error.message);
        } finally {
            setAutoGenerating(false);
        }
    }, [canAutoGenerate, serviceName, cityName, templateId]);
    

    const loadSeo = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/test-seo?${docId ? `id=${encodeURIComponent(docId)}` : `pathKey=${encodeURIComponent(pathKey)}`}`, { cache: 'no-store' });
            const data = await res.json();
            if (data && data.exists) {
                setSeo({
                    title: data.title || "",
                    description: data.description || "",
                    keywords: Array.isArray(data.keywords) ? data.keywords : [],
                    ogImageUrl: data.ogImageUrl || "",
                    metaRobots: data.metaRobots || "index, follow",
                });
                if (data.id && !docId) setDocId(data.id);
            } else {
                setSeo({ title: "", description: "", keywords: [], ogImageUrl: "", metaRobots: "index, follow" });
            }
        } finally {
            setLoading(false);
        }
    }, [pathKey, docId]);

    const saveSeo = useCallback(async () => {
        const resp = await fetch(`/api/test-seo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pathKey, id: docId || undefined, seo }),
        });
        const r = await resp.json();
        if (!resp.ok) {
            console.error('[saveSeo] failed', r);
            throw new Error(r?.error || 'Failed to save SEO');
        }
        if (r?.id && !docId) setDocId(r.id);
    }, [pathKey, seo, docId]);

    const loadSections = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/test-pages?${docId ? `id=${encodeURIComponent(docId)}` : `pathKey=${encodeURIComponent(pathKey)}`}`, { cache: 'no-store' });
            const data = await res.json();
            if (data && Array.isArray(data.sections)) {
                setSections(data.sections);
                if (data.id && !docId) setDocId(data.id);
                // hydrate slug inputs if empty and pathKey present
                if (data.pathKey && !slug1 && !slug2 && !slug3) {
                    const parts = (data.pathKey || '').split('/').filter(Boolean);
                    setSlug1(parts[0] || '');
                    setSlug2(parts[1] || '');
                    setSlug3(parts[2] || '');
                }
                // hydrate preview from first hero section if present (for legacy single-hero view)
                const hero = data.sections.find((s) => s?.type === 'hero' && s?.props);
                if (hero && hero.props) {
                    setPreview((prev) => ({ ...prev, ...hero.props }));
                }
            } else {
                setSections([]);
            }
        } finally {
            setLoading(false);
        }
    }, [pathKey, docId]);

    const saveSections = useCallback(async (sectionsToSave) => {
        const payloadSections = Array.isArray(sectionsToSave) ? sectionsToSave : sections;
        const resp = await fetch(`/api/test-pages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pathKey, id: docId || undefined, sections: payloadSections }),
        });
        const r = await resp.json();
        if (!resp.ok) {
            console.error('[saveSections] failed', r);
            throw new Error(r?.error || 'Failed to save Sections');
        }
        if (r?.id && !docId) setDocId(r.id);
    }, [pathKey, sections, docId]);

    const handleSaveAll = useCallback(async () => {
        setSaveOk(false);
        setSaveError("");
        
        // Validate pathKey exists
        if (!pathKey || pathKey.trim() === '') {
            setSaveError('Path is required. Please fill in at least slug1.');
            alert('Error: Path is required to save the page.');
            return;
        }
        
        // Check if sections exist
        const effectiveSections = sections && sections.length ? [...sections] : [];
        if (effectiveSections.length === 0) {
            setSaveError('No sections to save. Please add at least one section.');
            alert('Error: No sections to save.');
            return;
        }
        
        try {
            console.log('[handleSaveAll] Starting save...', { pathKey, sectionsCount: effectiveSections.length });
            
            // Save sections
            await saveSections(effectiveSections);
            console.log('[handleSaveAll] Sections saved successfully');
            
            // Save SEO
            await saveSeo();
            console.log('[handleSaveAll] SEO saved successfully');
            
            // Small delay for Firestore sync
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Verify write before redirect - use id parameter since doc ID = pathKey
            const verifyRes = await fetch(`/api/test-pages?id=${encodeURIComponent(pathKey)}&v=${Date.now()}`, { cache: 'no-store' });
            const verifyData = await verifyRes.json();
            console.log('[handleSaveAll] Verify result:', verifyData);
            
            if (!verifyData.exists) {
                // If verification fails, still consider it a success since save didn't throw
                console.warn('[handleSaveAll] Verification returned no data, but save completed without error');
            }
            
            setSaveOk(true);
            alert('✅ Page saved successfully!');
            router.push(`/services?ts=${Date.now()}`);
        } catch (e) {
            console.error('[handleSaveAll] Error:', e);
            setSaveError(e?.message || 'Save failed');
            alert(`❌ Save failed: ${e?.message || 'Unknown error'}`);
        }
    }, [sections, saveSections, saveSeo, docId, pathKey, router]);

    useEffect(() => {
        // Helper to prepopulate SEO from template
        const tryPrepopulateSeo = () => {
            const templateId = searchParams?.get('template');
            const citySlug = searchParams?.get('city');
            
            if (templateId && citySlug) {
                // Find city name from slug
                const cityData = findCityBySlug(citySlug);
                const cityName = cityData?.name || citySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                
                // Generate SEO from template
                const generatedSeo = generateSeoForPage(templateId, cityName, citySlug);
                
                if (generatedSeo) {
                    setSeo({
                        title: generatedSeo.title || "",
                        description: generatedSeo.description || "",
                        keywords: generatedSeo.keywords || [],
                        ogImageUrl: "",
                        metaRobots: generatedSeo.metaRobots || "index, follow",
                    });
                    return true; // SEO was prepopulated
                }
            }
            return false; // No prepopulation
        };

        if (defaultId) {
            setDocId(defaultId);
            setTimeout(() => {
                loadSeo();
                loadSections();
            }, 0);
            return;
        }
        if (defaultPathKey) {
            const parts = defaultPathKey.split('/').filter(Boolean);
            setSlug1(parts[0] || '');
            setSlug2(parts[1] || '');
            setSlug3(parts[2] || '');
            
            // Try prepopulating SEO first, then load existing if no prepopulation
            const prepopulated = tryPrepopulateSeo();
            
            setTimeout(() => {
                if (!prepopulated) loadSeo();
                loadSections();
            }, 0);
            return;
        }
        const pk = searchParams?.get('pathKey');
        if (pk) {
            const parts = pk.split('/').filter(Boolean);
            setSlug1(parts[0] || '');
            setSlug2(parts[1] || '');
            setSlug3(parts[2] || '');
            
            // Try prepopulating SEO first, then load existing if no prepopulation
            const prepopulated = tryPrepopulateSeo();
            
            setTimeout(() => {
                if (!prepopulated) loadSeo();
                loadSections();
            }, 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    return (
        <div>
            <ActionBar onSave={handleSaveAll} saveDisabled={!slug1 && !slug2 && !slug3} />
            <div className='w-full px-3 py-2 bg-white border-b grid grid-cols-3 gap-2'>
                <input className='border rounded px-2 py-1 text-sm' placeholder='district (delhi-ncr)' value={slug1} onChange={(e) => setSlug1(e.target.value)} />
                <input className='border rounded px-2 py-1 text-sm' placeholder='city (hapur)' value={slug2} onChange={(e) => setSlug2(e.target.value)} />
                <input className='border rounded px-2 py-1 text-sm' placeholder='service-slug' value={slug3} onChange={(e) => setSlug3(e.target.value)} />
                <div className='col-span-3 flex items-center gap-2 flex-wrap'>
                    <span className='text-xs text-gray-500'>Path: {pathKey || '-'}</span>
                    {canAutoGenerate && (
                        <button
                            onClick={handleAutoGenerate}
                            disabled={autoGenerating}
                            className={`ml-auto px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2
                                ${autoGenerating 
                                    ? 'bg-purple-100 text-purple-400 cursor-wait' 
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg'
                                }`}
                        >
                            {autoGenerating ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    ✨ Auto Generate with AI
                                </>
                            )}
                        </button>
                    )}
                    {canAutoGenerate && (
                        <span className='text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded'>
                            {serviceName} • {cityName}
                        </span>
                    )}
                    {saveError && <span className='text-xs text-red-600'>Error: {saveError}</span>}
                    {saveOk && <span className='text-xs text-green-600'>Saved</span>}
                </div>
            </div>
            <div className='w-full h-screen overflow-hidden grid grid-cols-[auto_380px]'>
                <div className='flex-1 p-4 overflow-y-auto'>
                    <div className='bg-white w-full min-h-[1200px] rounded-md'>
                        <SectionPreview sections={sections} />
                    </div>
                </div>
                <TabsClient seo={seo} setSeo={setSeo} sections={sections} setSections={setSections} />
            </div>
        </div>
    )
}

export default Client