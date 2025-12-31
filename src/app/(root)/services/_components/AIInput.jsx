"use client";
import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * AIInput - Input field with AI generation button
 * Used across all sections for AI-powered content generation
 */
const AIInput = ({
  value,
  onChange,
  placeholder,
  className = '',
  // AI context
  sectionType,
  fieldName,
  service,
  city,
  arrayIndex,
  // Disable AI when context is missing
  aiEnabled = true,
  // Textarea mode
  multiline = false,
  rows = 3,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateContent = useCallback(async () => {
    if (!aiEnabled || !sectionType || !fieldName) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'section_field',
          sectionType,
          fieldName,
          service: service || 'Technology Services',
          city: city || 'India',
          currentContent: value || '',
          arrayIndex,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'AI generation failed');
      }
      
      if (data.content) {
        onChange(data.content);
      }
    } catch (err) {
      console.error('[AIInput Error]', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [aiEnabled, sectionType, fieldName, service, city, value, arrayIndex, onChange]);

  const AIButton = () => (
    <button
      type="button"
      onClick={generateContent}
      disabled={loading || !aiEnabled}
      className={`absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded transition-all
        ${loading ? 'text-purple-400 animate-pulse' : 
          !aiEnabled ? 'text-gray-300 cursor-not-allowed' :
          'text-purple-500 hover:text-purple-700 hover:bg-purple-50'}`}
      title={!aiEnabled ? 'Select template & city to enable AI' : 'Generate with AI ✨'}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Sparkles size={14} />
      )}
    </button>
  );

  if (multiline) {
    return (
      <div className="relative">
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-sm 
            ring-offset-background placeholder:text-muted-foreground 
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
            focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 
            resize-none ${className}`}
        />
        <button
          type="button"
          onClick={generateContent}
          disabled={loading || !aiEnabled}
          className={`absolute right-2 top-2 p-1 rounded transition-all
            ${loading ? 'text-purple-400 animate-pulse' : 
              !aiEnabled ? 'text-gray-300 cursor-not-allowed' :
              'text-purple-500 hover:text-purple-700 hover:bg-purple-50'}`}
          title={!aiEnabled ? 'Select template & city to enable AI' : 'Generate with AI ✨'}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Sparkles size={14} />
          )}
        </button>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="relative">
      <Input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pr-8 ${className}`}
      />
      <AIButton />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default AIInput;
