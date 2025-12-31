import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const snap = await getDocs(collection(db, "xenotix_test_pages"));
    const items = snap.docs.map((d, idx) => {
      const data = d.data() || {};
      let title = '';
      if (Array.isArray(data.sections)) {
        const hero = data.sections.find((s) => s && s.type === 'hero');
        if (hero && hero.props) {
          title = hero.props.headline || hero.props.titleLine1 || '';
        }
      }
      console.log('[test-pages][GET] item:', data); 
      return {
        id: d.id,
        index: idx + 1,
        pathKey: data.pathKey || d.id,
        sectionsCount: Array.isArray(data.sections) ? data.sections.length : 0,
        updatedAt: data.updatedAt?.toMillis?.() || null,
        title,
      };
    }).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 200);
    return NextResponse.json({ items }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}


