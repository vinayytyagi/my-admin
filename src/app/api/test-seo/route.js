import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

const COLLECTION = "xenotix_test_seo";

function normalizePathKey(pathKey) {
  if (!pathKey) return "";
  return pathKey
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean)
    .join("/");
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const pathKey = normalizePathKey(searchParams.get("pathKey") || "");
    if (id) {
      const ref = doc(db, COLLECTION, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return NextResponse.json({ exists: false }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
      const data = snap.data();
      return NextResponse.json({ exists: true, id, ...data }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }
    if (pathKey) {
      const q = query(collection(db, COLLECTION), where("pathKey", "==", pathKey));
      const qs = await getDocs(q);
      if (qs.empty) return NextResponse.json({ exists: false }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
      const first = qs.docs[0];
      return NextResponse.json({ exists: true, id: first.id, ...first.data() }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
    }
    return NextResponse.json({ error: "id or pathKey is required" }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('[test-seo][POST] body:', body);
    const id = body?.id;
    const pathKey = normalizePathKey(body?.pathKey || "");
    if (!id && !pathKey) {
      return NextResponse.json({ error: "id or pathKey is required" }, { status: 400 });
    }

    const seo = body?.seo || {};
    const payload = {
      pathKey,
      title: (seo.title || "").toString().slice(0, 120),
      description: (seo.description || "").toString().slice(0, 300),
      keywords: Array.isArray(seo.keywords)
        ? seo.keywords
        : typeof seo.keywords === "string"
        ? seo.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : [],
      ogImageUrl: seo.ogImageUrl || "",
      metaRobots: seo.metaRobots || "index, follow",
      updatedAt: serverTimestamp(),
    };

    const ref = doc(db, COLLECTION, id || pathKey);
    const existing = await getDoc(ref);
    const createdAt = existing.exists() && existing.data()?.createdAt ? existing.data().createdAt : serverTimestamp();
    await setDoc(ref, { ...payload, createdAt });
    console.log('[test-seo][POST] saved id:', (id || pathKey));
    return NextResponse.json({ success: true, id: (id || pathKey) }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[test-seo][POST] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}


