import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, deleteDoc } from "firebase/firestore";

const PAGES_COLLECTION = "xenotix_test_pages";
const SEO_COLLECTION = "xenotix_test_seo";

export async function DELETE(request) {
  try {
    const body = await request.json();
    const id = body?.id;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const pageRef = doc(db, PAGES_COLLECTION, id);
    const seoRef = doc(db, SEO_COLLECTION, id);

    await Promise.all([
      deleteDoc(pageRef).catch(() => {}),
      deleteDoc(seoRef).catch(() => {}),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || "Delete failed" }, { status: 500 });
  }
}


