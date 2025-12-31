"use client";
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ui/ImageUpload';
import { Trash2, ChevronUp, ChevronDown, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { getSlugTemplateById } from '../_data/slugTemplates';
import { findCityBySlug } from '../_data/indiaLocations';
import AIInput from './AIInput';

const SECTION_TYPES = [
  { value: 'hero', label: 'Hero' },
  { value: 'features', label: 'Features' },
  { value: 'dataSection', label: 'Data Section' },
  { value: 'horizontalStrip', label: 'Horizontal Strip' },
  { value: 'scaling', label: 'Scaling' },
  { value: 'customerTestimonials', label: 'Customer Testimonials' },
];

const SectionManager = ({ sections, setSections }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const selected = selectedIndex !== null ? sections[selectedIndex] : null;

  // Get AI context from URL params
  const searchParams = useSearchParams();
  const templateId = searchParams?.get('template') || '';
  const citySlug = searchParams?.get('city') || '';
  
  const template = templateId ? getSlugTemplateById(templateId) : null;
  const cityData = citySlug ? findCityBySlug(citySlug) : null;
  const serviceName = template?.label?.replace(/^[^\s]+\s/, '') || '';
  const cityName = cityData?.name || citySlug?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || '';
  const aiEnabled = !!(templateId && citySlug);

  const addSection = (type) => {
    const existingIndex = sections.findIndex((s) => s?.type === type);
    if (existingIndex !== -1) {
      setSelectedIndex(existingIndex);
      return;
    }
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      visible: true,
      order: sections.length,
      props: {},
    };
    setSections([...sections, newSection]);
    setSelectedIndex(sections.length);
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    if (selectedIndex === index) setSelectedIndex(null);
    else if (selectedIndex > index) setSelectedIndex(selectedIndex - 1);
  };

  const moveSection = (index, direction) => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    newSections.forEach((s, i) => { s.order = i; });
    setSections(newSections);
    if (selectedIndex === index) setSelectedIndex(targetIndex);
    else if (selectedIndex === targetIndex) setSelectedIndex(index);
  };

  const updateSectionAt = (index, updates) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    setSections(newSections);
  };

  const updateProp = (key, value) => {
    const newSections = [...sections];
    newSections[selectedIndex] = {
      ...newSections[selectedIndex],
      props: { ...newSections[selectedIndex].props, [key]: value },
    };
    setSections(newSections);
  };

  const updateArrayItem = (arrayKey, index, updates) => {
    const newSections = [...sections];
    const currentArray = Array.isArray(newSections[selectedIndex].props[arrayKey]) ? [...newSections[selectedIndex].props[arrayKey]] : [];
    currentArray[index] = { ...currentArray[index], ...updates };
    updateProp(arrayKey, currentArray);
  };

  const addArrayItem = (arrayKey, defaultItem = {}) => {
    const newSections = [...sections];
    const currentArray = Array.isArray(newSections[selectedIndex].props[arrayKey]) ? [...newSections[selectedIndex].props[arrayKey]] : [];
    currentArray.push(defaultItem);
    updateProp(arrayKey, currentArray);
  };

  const removeArrayItem = (arrayKey, index) => {
    const newSections = [...sections];
    const currentArray = Array.isArray(newSections[selectedIndex].props[arrayKey]) ? [...newSections[selectedIndex].props[arrayKey]] : [];
    currentArray.splice(index, 1);
    updateProp(arrayKey, currentArray);
  };

  // Common AI props for all fields
  const aiProps = {
    service: serviceName,
    city: cityName,
    aiEnabled,
  };

  const renderFields = () => {
    if (!selected) return null;
    const { type, props } = selected;

    switch (type) {
      case 'hero':
        return (
          <div className="space-y-3">
            <div><Label>Left Badge Text</Label><AIInput sectionType="hero" fieldName="leftBadgeText" {...aiProps} value={props.leftBadgeText || ''} onChange={(v) => updateProp('leftBadgeText', v)} placeholder="e.g., Trusted by 500+ Businesses" /></div>
            <div><Label>Headline</Label><AIInput sectionType="hero" fieldName="headline" {...aiProps} value={props.headline || ''} onChange={(v) => updateProp('headline', v)} placeholder="Main headline" /></div>
            <div><Label>Subheadline</Label><AIInput sectionType="hero" fieldName="subheadline" {...aiProps} value={props.subheadline || ''} onChange={(v) => updateProp('subheadline', v)} multiline rows={2} placeholder="Supporting subheadline" /></div>
            <div><Label>CTA Label</Label><AIInput sectionType="hero" fieldName="ctaLabel" {...aiProps} value={props.ctaLabel || ''} onChange={(v) => updateProp('ctaLabel', v)} placeholder="e.g., Get Free Consultation" /></div>
            <div><Label>Stat Title</Label><AIInput sectionType="hero" fieldName="statTitle" {...aiProps} value={props.statTitle || ''} onChange={(v) => updateProp('statTitle', v)} placeholder="e.g., 95% Client Satisfaction" /></div>
            <div><Label>Stat Subtitle</Label><AIInput sectionType="hero" fieldName="statSubtitle" {...aiProps} value={props.statSubtitle || ''} onChange={(v) => updateProp('statSubtitle', v)} placeholder="e.g., Based on 2024 feedback" /></div>
            <div><Label>Stat Note</Label><AIInput sectionType="hero" fieldName="statNote" {...aiProps} value={props.statNote || ''} onChange={(v) => updateProp('statNote', v)} placeholder="From customers who used Artifact for at least 12 months." /></div>
            <div><Label>Review Source</Label><AIInput sectionType="hero" fieldName="reviewSource" {...aiProps} value={props.reviewSource || ''} onChange={(v) => updateProp('reviewSource', v)} placeholder="e.g., Clutch Reviews" /></div>
            <div><Label>Review Count</Label><AIInput sectionType="hero" fieldName="reviewCount" {...aiProps} value={props.reviewCount || ''} onChange={(v) => updateProp('reviewCount', v)} placeholder="e.g., 127+ Reviews" /></div>
            <ImageUpload value={props.topLeftImage || ''} onChange={(url) => updateProp('topLeftImage', url)} label="Top Left Image" folder="services/hero" />
            <ImageUpload value={props.bottomBgImage || ''} onChange={(url) => updateProp('bottomBgImage', url)} label="Bottom BG Image" folder="services/hero" />
            <div><Label>Bottom Overlay Text</Label><AIInput sectionType="hero" fieldName="bottomOverlayText" {...aiProps} value={props.bottomOverlayText || ''} onChange={(v) => updateProp('bottomOverlayText', v)} placeholder="Summarize trends from Q1 sales data" /></div>
          </div>
        );
      case 'features':
        const items = Array.isArray(props.items) ? props.items : [];
        return (
          <div className="space-y-3">
            <div><Label>Heading</Label><AIInput sectionType="features" fieldName="heading" {...aiProps} value={props.heading || ''} onChange={(v) => updateProp('heading', v)} placeholder="Section heading" /></div>
            <div><Label>Subheading</Label><AIInput sectionType="features" fieldName="subheading" {...aiProps} value={props.subheading || ''} onChange={(v) => updateProp('subheading', v)} placeholder="Section subheading" /></div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Support Banner</Label>
              </div>
              <div className="grid gap-2">
                <div><Label className="text-xs">Title</Label><AIInput sectionType="features" fieldName="supportTitle" {...aiProps} value={props.supportTitle || ''} onChange={(v) => updateProp('supportTitle', v)} className="text-xs h-8" placeholder="Hello 👋 I'm Jake from support." /></div>
                <div><Label className="text-xs">Subtitle</Label><AIInput sectionType="features" fieldName="supportSubtitle" {...aiProps} value={props.supportSubtitle || ''} onChange={(v) => updateProp('supportSubtitle', v)} className="text-xs h-8" placeholder="Let me know if you have any questions." /></div>
                <div><Label className="text-xs">Button Label</Label><AIInput sectionType="features" fieldName="supportButtonLabel" {...aiProps} value={props.supportButtonLabel || ''} onChange={(v) => updateProp('supportButtonLabel', v)} className="text-xs h-8" placeholder="Contact us" /></div>
                <ImageUpload value={props.supportAvatar || ''} onChange={(url) => updateProp('supportAvatar', url)} label="Avatar Image" folder="services/features" className="text-xs" />
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Feature Items</Label>
                <Button size="sm" onClick={() => addArrayItem('items', { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}` , title: '', description: '', frontImage: '', backgroundImage: '' })}>+ Add</Button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item, idx) => (
                  <div key={idx} className="border rounded p-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Item {idx + 1}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeArrayItem('items', idx)}>Remove</Button>
                    </div>
                    <div><Label className="text-xs">Title</Label><AIInput sectionType="features" fieldName="items.title" arrayIndex={idx} {...aiProps} value={item.title || ''} onChange={(v) => updateArrayItem('items', idx, { title: v })} className="text-xs h-8" /></div>
                    <div><Label className="text-xs">Description</Label><AIInput sectionType="features" fieldName="items.description" arrayIndex={idx} {...aiProps} value={item.description || ''} onChange={(v) => updateArrayItem('items', idx, { description: v })} className="text-xs h-8" multiline rows={2} /></div>
                    <ImageUpload value={item.frontImage || ''} onChange={(url) => updateArrayItem('items', idx, { frontImage: url })} label="Front Image" folder="services/features" className="text-xs" />
                    <ImageUpload value={item.backgroundImage || ''} onChange={(url) => updateArrayItem('items', idx, { backgroundImage: url })} label="Background Image" folder="services/features" className="text-xs" />
                  </div>
                ))}
                {items.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No items. Click "Add" to create one.</p>}
              </div>
            </div>
          </div>
        );
      case 'dataSection':
        const brands = Array.isArray(props.brands) ? props.brands : [];
        return (
          <div className="space-y-3">
            <div><Label>Title Line 1</Label><AIInput sectionType="dataSection" fieldName="titleLine1" {...aiProps} value={props.titleLine1 || ''} onChange={(v) => updateProp('titleLine1', v)} /></div>
            <div><Label>Title Line 2</Label><AIInput sectionType="dataSection" fieldName="titleLine2" {...aiProps} value={props.titleLine2 || ''} onChange={(v) => updateProp('titleLine2', v)} /></div>
            <div><Label>Metric Value</Label><AIInput sectionType="dataSection" fieldName="metricValue" {...aiProps} value={props.metricValue || ''} onChange={(v) => updateProp('metricValue', v)} placeholder="e.g., 500+" /></div>
            <div><Label>Metric Label</Label><AIInput sectionType="dataSection" fieldName="metricLabel" {...aiProps} value={props.metricLabel || ''} onChange={(v) => updateProp('metricLabel', v)} placeholder="e.g., Projects Delivered" /></div>
            <ImageUpload value={props.imageSrc || ''} onChange={(url) => updateProp('imageSrc', url)} label="Image Source" folder="services/data-section" />
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Brands</Label>
                <Button size="sm" onClick={() => addArrayItem('brands', { name: '', top: '', bottom: '' })}>+ Add</Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands.map((brand, idx) => (
                  <div key={idx} className="border rounded p-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Brand {idx + 1}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeArrayItem('brands', idx)}>Remove</Button>
                    </div>
                    <div><Label className="text-xs">Name</Label><AIInput sectionType="dataSection" fieldName="brands.name" arrayIndex={idx} {...aiProps} value={brand.name || ''} onChange={(v) => updateArrayItem('brands', idx, { name: v })} className="text-xs h-8" /></div>
                    <div><Label className="text-xs">Top Info</Label><AIInput sectionType="dataSection" fieldName="brands.top" arrayIndex={idx} {...aiProps} value={brand.top || ''} onChange={(v) => updateArrayItem('brands', idx, { top: v })} className="text-xs h-8" /></div>
                    <div><Label className="text-xs">Bottom Info</Label><AIInput sectionType="dataSection" fieldName="brands.bottom" arrayIndex={idx} {...aiProps} value={brand.bottom || ''} onChange={(v) => updateArrayItem('brands', idx, { bottom: v })} className="text-xs h-8" /></div>
                  </div>
                ))}
                {brands.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No brands. Click "Add" to create one.</p>}
              </div>
            </div>
          </div>
        );
      case 'horizontalStrip':
        return (
          <div className="space-y-3">
            <div><Label>Texts (comma separated)</Label><AIInput sectionType="horizontalStrip" fieldName="texts" {...aiProps} value={(props.texts || []).join(', ')} onChange={(v) => updateProp('texts', v.split(',').map(s => s.trim()).filter(Boolean))} multiline rows={2} placeholder="Innovation First, Quality Assured, 24/7 Support" /></div>
            <ImageUpload value={props.bgImage || ''} onChange={(url) => updateProp('bgImage', url)} label="BG Image" folder="services/horizontal-strip" />
            <ImageUpload value={props.overlayImage || ''} onChange={(url) => updateProp('overlayImage', url)} label="Overlay Image" folder="services/horizontal-strip" />
          </div>
        );
      case 'scaling':
        const columns = Array.isArray(props.columns) ? props.columns : [];
        return (
          <div className="space-y-3">
            <div><Label>Heading Line 1</Label><AIInput sectionType="scaling" fieldName="headingLine1" {...aiProps} value={props.headingLine1 || ''} onChange={(v) => updateProp('headingLine1', v)} /></div>
            <div><Label>Heading Line 2</Label><AIInput sectionType="scaling" fieldName="headingLine2" {...aiProps} value={props.headingLine2 || ''} onChange={(v) => updateProp('headingLine2', v)} /></div>
            <div><Label>Subtext</Label><AIInput sectionType="scaling" fieldName="subtext" {...aiProps} value={props.subtext || ''} onChange={(v) => updateProp('subtext', v)} multiline rows={2} /></div>
            <div><Label>CTA Label</Label><AIInput sectionType="scaling" fieldName="ctaLabel" {...aiProps} value={props.ctaLabel || ''} onChange={(v) => updateProp('ctaLabel', v)} /></div>
            <ImageUpload value={props.bgImage || ''} onChange={(url) => updateProp('bgImage', url)} label="BG Image" folder="services/scaling" />
            <ImageUpload value={props.fgImage || ''} onChange={(url) => updateProp('fgImage', url)} label="FG Image" folder="services/scaling" />
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Columns</Label>
                <Button size="sm" onClick={() => addArrayItem('columns', { title: '', desc: '' })}>+ Add</Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {columns.map((col, idx) => (
                  <div key={idx} className="border rounded p-2 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Column {idx + 1}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeArrayItem('columns', idx)}>Remove</Button>
                    </div>
                    <div><Label className="text-xs">Title</Label><AIInput sectionType="scaling" fieldName="columns.title" arrayIndex={idx} {...aiProps} value={col.title || ''} onChange={(v) => updateArrayItem('columns', idx, { title: v })} className="text-xs h-8" /></div>
                    <div><Label className="text-xs">Description</Label><AIInput sectionType="scaling" fieldName="columns.desc" arrayIndex={idx} {...aiProps} value={col.desc || ''} onChange={(v) => updateArrayItem('columns', idx, { desc: v })} className="text-xs h-8" multiline rows={2} /></div>
                  </div>
                ))}
                {columns.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No columns. Click "Add" to create one.</p>}
              </div>
            </div>
          </div>
        );
      case 'customerTestimonials':
        const testimonials = Array.isArray(props.testimonials) ? props.testimonials : [];
        const faqs = Array.isArray(props.faqs) ? props.faqs : [];
        return (
          <div className="space-y-3">
            <div><Label>Header Title</Label><AIInput sectionType="customerTestimonials" fieldName="headerTitle" {...aiProps} value={props.headerTitle || ''} onChange={(v) => updateProp('headerTitle', v)} /></div>
            <div><Label>CTA Label</Label><AIInput sectionType="customerTestimonials" fieldName="ctaLabel" {...aiProps} value={props.ctaLabel || ''} onChange={(v) => updateProp('ctaLabel', v)} /></div>
            <ImageUpload value={props.backgroundImage || ''} onChange={(url) => updateProp('backgroundImage', url)} label="Background Image" folder="services/testimonials" />
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Label>Testimonials</Label>
                <Button size="sm" onClick={() => addArrayItem('testimonials', { id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`, name: '', title: '', quote: '', image: '' })}>+ Add</Button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {testimonials.map((test, idx) => (
                  <div key={idx} className="border rounded p-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Testimonial {idx + 1}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeArrayItem('testimonials', idx)}>Remove</Button>
                    </div>
                    <div><Label className="text-xs">Name</Label><AIInput sectionType="customerTestimonials" fieldName="testimonials.name" arrayIndex={idx} {...aiProps} value={test.name || ''} onChange={(v) => updateArrayItem('testimonials', idx, { name: v })} className="text-xs h-8" /></div>
                    <div><Label className="text-xs">Title</Label><AIInput sectionType="customerTestimonials" fieldName="testimonials.title" arrayIndex={idx} {...aiProps} value={test.title || ''} onChange={(v) => updateArrayItem('testimonials', idx, { title: v })} className="text-xs h-8" /></div>
                    <div><Label className="text-xs">Quote</Label><AIInput sectionType="customerTestimonials" fieldName="testimonials.quote" arrayIndex={idx} {...aiProps} value={test.quote || ''} onChange={(v) => updateArrayItem('testimonials', idx, { quote: v })} className="text-xs h-8" multiline rows={3} /></div>
                    <ImageUpload value={test.image || ''} onChange={(url) => updateArrayItem('testimonials', idx, { image: url })} label="Image" folder="services/testimonials" className="text-xs" />
                  </div>
                ))}
                {testimonials.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No testimonials. Click "Add" to create one.</p>}
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <Label>FAQs</Label>
                <Button size="sm" onClick={() => addArrayItem('faqs', { q: '', a: '' })}>+ Add</Button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border rounded p-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">FAQ {idx + 1}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeArrayItem('faqs', idx)}>Remove</Button>
                    </div>
                    <div><Label className="text-xs">Question</Label><AIInput sectionType="customerTestimonials" fieldName="faqs.q" arrayIndex={idx} {...aiProps} value={faq.q || ''} onChange={(v) => updateArrayItem('faqs', idx, { q: v })} className="text-xs h-8" /></div>
                    <div><Label className="text-xs">Answer</Label><AIInput sectionType="customerTestimonials" fieldName="faqs.a" arrayIndex={idx} {...aiProps} value={faq.a || ''} onChange={(v) => updateArrayItem('faqs', idx, { a: v })} className="text-xs h-8" multiline rows={3} /></div>
                  </div>
                ))}
                {faqs.length === 0 && <p className="text-xs text-gray-500 text-center py-2">No FAQs. Click "Add" to create one.</p>}
              </div>
            </div>
          </div>
        );
      default:
        return <div className="text-sm text-gray-500">No fields available for this section type</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Sections</h3>
          <select className="text-xs border rounded px-2 py-1" onChange={(e) => e.target.value && addSection(e.target.value)}>
            <option value="">Add Section...</option>
            {SECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        {/* AI Status */}
        {aiEnabled ? (
          <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
            <Sparkles size={12} /> AI enabled for {serviceName} in {cityName}
          </div>
        ) : (
          <div className="text-xs text-gray-400 px-2 py-1">
            💡 Create from Dashboard to enable AI
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          {sections.map((section, index) => (
            <div key={section.id} className={`p-2 border rounded text-xs ${selectedIndex === index ? 'bg-blue-50 border-blue-300' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">{SECTION_TYPES.find(t => t.value === section.type)?.label || section.type}</span>
                <div className="flex gap-1">
                  <button onClick={() => updateSectionAt(index, { visible: !(section.visible !== false) })} className="p-0.5" aria-label={section.visible !== false ? 'Hide section' : 'Show section'}>
                    {section.visible !== false ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>
                  <button onClick={() => moveSection(index, 'up')} disabled={index === 0}><ChevronUp size={12} /></button>
                  <button onClick={() => moveSection(index, 'down')} disabled={index === sections.length - 1}><ChevronDown size={12} /></button>
                  <button onClick={() => removeSection(index)}><Trash2 size={12} /></button>
                </div>
              </div>
              <button onClick={() => setSelectedIndex(index)} className="text-blue-600 hover:underline w-full text-left">
                {selectedIndex === index ? 'Editing...' : 'Edit'}
              </button>
            </div>
          ))}
          {sections.length === 0 && <div className="text-xs text-gray-500 p-2 text-center">No sections. Add one above.</div>}
        </div>
      </div>
      {selected && (
        <div className="border-t p-3 overflow-y-auto max-h-96">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Edit: {SECTION_TYPES.find(t => t.value === selected.type)?.label}</h4>
              <button onClick={() => setSelectedIndex(null)} className="text-xs text-gray-500">Close</button>
            </div>
            {renderFields()}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionManager;
