"use client";
import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Client from '../_components/Client';

/**
 * Inner component that uses useSearchParams (needs Suspense)
 */
function NewServicePageContent() {
  const searchParams = useSearchParams();
  const pathKey = searchParams?.get('pathKey') || '';
  const template = searchParams?.get('template') || '';
  const city = searchParams?.get('city') || '';

  return (
    <Client 
      defaultPathKey={pathKey}
      templateId={template}
      citySlug={city}
    />
  );
}

/**
 * New Page route - supports pre-filling from URL params
 * Used by India Pages Dashboard for quick creation
 */
export default function NewServicePage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <NewServicePageContent />
    </Suspense>
  );
}
