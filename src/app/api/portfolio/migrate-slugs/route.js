import { db } from "@/firebase/config";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { normalizeSlug } from "@/util/generateSlug";

/**
 * ONE-TIME MIGRATION: Fix all portfolio slugs to remove trailing hyphens
 * 
 * GET /api/portfolio/migrate-slugs
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    
    if (key !== "xenotix-migrate-2024") {
      return NextResponse.json(
        { error: "Unauthorized. Provide correct migration key." },
        { status: 401 }
      );
    }

    const portfoliosRef = collection(db, "xenotix_portfolios");
    const querySnapshot = await getDocs(portfoliosRef);

    const results = {
      total: 0,
      updated: 0,
      unchanged: 0,
      portfolios: []
    };

    for (const docSnapshot of querySnapshot.docs) {
      const portfolio = docSnapshot.data();
      const originalSlug = portfolio.slug || "";
      const normalizedSlugValue = normalizeSlug(originalSlug);
      
      results.total++;

      if (originalSlug !== normalizedSlugValue && normalizedSlugValue !== "") {
        const docRef = doc(db, "xenotix_portfolios", docSnapshot.id);
        await updateDoc(docRef, { slug: normalizedSlugValue });
        
        results.updated++;
        results.portfolios.push({
          id: docSnapshot.id,
          title: portfolio.title,
          oldSlug: originalSlug,
          newSlug: normalizedSlugValue
        });
      } else {
        results.unchanged++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete. Updated ${results.updated} of ${results.total} portfolios.`,
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
