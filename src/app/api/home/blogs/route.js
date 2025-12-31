import { NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

const defaultHeader = {
  badgeText: "BLOG UNIVERSE",
  title: "Insights & Stories",
  description:
    "Dive into our collection of thoughts, tutorials, and insights from the world of design and development",
};

const normalizeItem = (item) => {
  if (!item) return null;
  if (typeof item === "string") return { slug: item, overrides: {} };
  if (item.slug) {
    return {
      slug: item.slug,
      overrides: item.overrides && typeof item.overrides === "object" ? item.overrides : {},
    };
  }
  return null;
};

export async function GET() {
  try {
    const ref = doc(db, "home", "blogs");
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    const itemsFromDoc = Array.isArray(data.items)
      ? data.items.map(normalizeItem).filter(Boolean)
      : [];
    const legacyRecent = Array.isArray(data.recent)
      ? data.recent.map(normalizeItem).filter(Boolean)
      : [];
    const items = itemsFromDoc.length ? itemsFromDoc : legacyRecent;
    return NextResponse.json({
      success: true,
      blogs: {
        items,
        recent: items.map((item) => item.slug),
        header: { ...defaultHeader, ...(data.header || {}) },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to load homepage blogs config" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const normalizedItems = Array.isArray(body?.items)
      ? body.items.map(normalizeItem).filter(Boolean)
      : [];
    const fallbackRecent = Array.isArray(body?.recent) ? body.recent : [];
    const payload = {
      items: normalizedItems,
      recent: normalizedItems.length ? normalizedItems.map((item) => item.slug) : fallbackRecent,
      header: { ...defaultHeader, ...(body?.header || {}) },
    };
    const ref = doc(db, "home", "blogs");
    await setDoc(ref, payload, { merge: true });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save homepage blogs config" },
      { status: 500 }
    );
  }
}


