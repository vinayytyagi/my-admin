'use server';

import { revalidatePath } from 'next/cache';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const defaultHeader = {
  badgeText: 'BLOG UNIVERSE',
  title: 'Insights & Stories',
  description: 'Dive into our collection of thoughts, tutorials, and insights from the world of design and development',
};

const normalizeItem = (item) => {
  if (!item) return null;
  if (typeof item === 'string') return { slug: item, overrides: {} };
  if (item.slug) {
    return {
      slug: item.slug,
      overrides: item.overrides && typeof item.overrides === 'object' ? item.overrides : {},
    };
  }
  return null;
};

export async function getHomepageBlogs() {
  try {
    const ref = doc(db, 'home', 'blogs');
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    const itemsFromDoc = Array.isArray(data.items) ? data.items.map(normalizeItem).filter(Boolean) : [];
    const recentLegacy = Array.isArray(data.recent) ? data.recent.map(normalizeItem).filter(Boolean) : [];
    const items = itemsFromDoc.length ? itemsFromDoc : recentLegacy;
    return {
      success: true,
      blogs: {
        items,
        recent: items.map((item) => item.slug),
        header: { ...defaultHeader, ...(data.header || {}) },
      },
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch homepage blogs settings' };
  }
}

export async function saveHomepageBlogs(payload) {
  try {
    const normalizedItems = Array.isArray(payload?.items)
      ? payload.items.map(normalizeItem).filter(Boolean)
      : [];
    const fallbackRecent = Array.isArray(payload?.recent) ? payload.recent : [];
    const recent = normalizedItems.length ? normalizedItems.map((item) => item.slug) : fallbackRecent;
    const header = { ...defaultHeader, ...(payload?.header || {}) };
    const ref = doc(db, 'home', 'blogs');
    await setDoc(ref, { items: normalizedItems, recent, header }, { merge: true });
    revalidatePath('/home/feature/blogs');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to save homepage blogs settings' };
  }
}


