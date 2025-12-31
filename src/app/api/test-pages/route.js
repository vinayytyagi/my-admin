import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";

const COLLECTION = "xenotix_test_pages";

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
    console.log('[test-pages][GET] searchParams:', searchParams);
    const id = searchParams.get("id");
    const pathKey = normalizePathKey(searchParams.get("pathKey") || "");
    if (id) {
      const ref = doc(db, COLLECTION, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return NextResponse.json({ exists: false, sections: [] }, { status: 200 });
      const data = snap.data();
      return NextResponse.json({ exists: true, id, ...data }, { status: 200 });
    }
    if (pathKey) {
      // try to find by pathKey field
      const q = query(collection(db, COLLECTION), where("pathKey", "==", pathKey));
      const qs = await getDocs(q);
      if (qs.empty) return NextResponse.json({ exists: false, sections: [] }, { status: 200 });
      const first = qs.docs[0];
      return NextResponse.json({ exists: true, id: first.id, ...first.data() }, { status: 200 });
    }
    return NextResponse.json({ error: "id or pathKey is required" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('[test-pages][POST] body:', body);
    let docId = body?.id;
    const pathKey = normalizePathKey(body?.pathKey || "");
    const sections = Array.isArray(body?.sections) ? body.sections : [];

    if (!docId && !pathKey) {
      return NextResponse.json({ error: "id or pathKey is required" }, { status: 400 });
    }

    // basic validation of sections
    const allowedTypes = new Set([
      "hero",
      "features",
      "dataSection",
      "horizontalStrip",
      "scaling",
      "customerTestimonials",
    ]);
    const sanitized = sections
      .filter((s) => s && typeof s === "object")
      .map((s, idx) => ({
        id: s.id || `${Date.now()}-${idx}`,
        type: allowedTypes.has(s.type) ? s.type : "hero",
        visible: s.visible !== false,
        order: Number.isFinite(s.order) ? s.order : idx,
        props: s.props && typeof s.props === "object" ? s.props : {},
      }))
      .sort((a, b) => a.order - b.order);

    // If no docId provided, check if document exists by pathKey
    let existingDoc = null;
    if (!docId && pathKey) {
      const q = query(collection(db, COLLECTION), where("pathKey", "==", pathKey));
      const qs = await getDocs(q);
      if (!qs.empty) {
        existingDoc = qs.docs[0];
        docId = existingDoc.id;
        console.log('[test-pages][POST] Found existing doc by pathKey:', docId);
      }
    }

    // If still no docId, generate a random one (don't use pathKey as it contains slashes!)
    if (!docId) {
      docId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      console.log('[test-pages][POST] Generated new doc ID:', docId);
    }

    const ref = doc(db, COLLECTION, docId);
    const existing = existingDoc || await getDoc(ref);
    const existingData = existing.exists?.() ? existing.data?.() : (existing.data?.() || null);
    const createdAt = existingData?.createdAt || serverTimestamp();
    
    await setDoc(ref, {
      pathKey,
      sections: sanitized,
      createdAt,
      updatedAt: serverTimestamp(),
    });
    console.log('[test-pages][POST] saved doc ID:', docId, 'pathKey:', pathKey);
    return NextResponse.json({ success: true, id: docId }, { status: 200 });
  } catch (error) {
    console.error('[test-pages][POST] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


