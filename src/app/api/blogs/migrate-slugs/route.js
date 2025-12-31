import { db } from "@/firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { normalizeSlug } from "@/util/generateSlug";

/**
 * ONE-TIME MIGRATION: Fix all blog slugs to remove trailing hyphens
 * 
 * GET /api/blogs/migrate-slugs
 * 
 * This will update all blogs in the database to have clean slugs
 */
export async function GET(request) {
  try {
    // Check for authorization (optional - add a secret key check)
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    
    // Simple protection - change this key or remove for one-time use
    if (key !== "xenotix-migrate-2024") {
      return NextResponse.json(
        { error: "Unauthorized. Provide correct migration key." },
        { status: 401 }
      );
    }

    const blogsRef = collection(db, "xenotix_blogs");
    const querySnapshot = await getDocs(blogsRef);

    const updates = [];
    const results = {
      total: 0,
      updated: 0,
      unchanged: 0,
      blogs: []
    };

    for (const docSnapshot of querySnapshot.docs) {
      const blog = docSnapshot.data();
      const originalSlug = blog.slug || "";
      const normalizedSlugValue = normalizeSlug(originalSlug);
      
      results.total++;

      if (originalSlug !== normalizedSlugValue && normalizedSlugValue !== "") {
        // Slug needs to be updated
        const docRef = doc(db, "xenotix_blogs", docSnapshot.id);
        await updateDoc(docRef, { slug: normalizedSlugValue });
        
        results.updated++;
        results.blogs.push({
          id: docSnapshot.id,
          title: blog.title,
          oldSlug: originalSlug,
          newSlug: normalizedSlugValue
        });
      } else {
        results.unchanged++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete. Updated ${results.updated} of ${results.total} blogs.`,
      results
    });

  } catch (error) {
    console.error("Error during slug migration:", error);
    return NextResponse.json(
      { error: "Migration failed", details: error.message },
      { status: 500 }
    );
  }
}
