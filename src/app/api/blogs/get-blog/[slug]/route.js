import { db } from "@/firebase/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { NextResponse } from "next/server";
import { normalizeSlug } from "@/util/generateSlug";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is missing" },
        { status: 400 }
      );
    }

    const blogsRef = collection(db, "xenotix_blogs");
    
    // Normalize incoming slug (remove trailing hyphens)
    const normalizedIncomingSlug = normalizeSlug(slug);
    
    // Try to find blog with normalized slug first
    let q = query(blogsRef, where("slug", "==", normalizedIncomingSlug), limit(1));
    let querySnapshot = await getDocs(q);
    
    // If not found, try with trailing hyphen (for backwards compatibility with old slugs)
    if (querySnapshot.empty) {
      const slugWithHyphen = normalizedIncomingSlug + "-";
      q = query(blogsRef, where("slug", "==", slugWithHyphen), limit(1));
      querySnapshot = await getDocs(q);
    }
    
    // If still not found, try exact match with original slug
    if (querySnapshot.empty) {
      q = query(blogsRef, where("slug", "==", slug), limit(1));
      querySnapshot = await getDocs(q);
    }

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    const blog = querySnapshot.docs[0].data();
    const id = querySnapshot.docs[0].id;

    // Always return normalized slug for consistent URLs
    return NextResponse.json({ success: true, blog: { id, ...blog, slug: normalizeSlug(blog.slug) } });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog", details: error.message },
      { status: 500 }
    );
  }
}