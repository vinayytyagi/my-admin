import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { normalizeSlug } from "@/util/generateSlug";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    const portfoliosRef = collection(db, "xenotix_portfolios");
    
    // Normalize incoming slug (remove trailing hyphens)
    const normalizedIncomingSlug = normalizeSlug(slug);
    
    // Try to find portfolio with normalized slug first
    let q = query(portfoliosRef, where("slug", "==", normalizedIncomingSlug), limit(1));
    let querySnapshot = await getDocs(q);
    
    // If not found, try with trailing hyphen (for backwards compatibility with old slugs)
    if (querySnapshot.empty) {
      const slugWithHyphen = normalizedIncomingSlug + "-";
      q = query(portfoliosRef, where("slug", "==", slugWithHyphen), limit(1));
      querySnapshot = await getDocs(q);
    }
    
    // If still not found, try exact match with original slug
    if (querySnapshot.empty) {
      q = query(portfoliosRef, where("slug", "==", slug), limit(1));
      querySnapshot = await getDocs(q);
    }

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "Portfolio not found" },
        { status: 404 }
      );
    }

    let portfolio = null;
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      let createdAtISO = null;
      let updatedAtISO = null;

      try {
        if (data.createdAt?.seconds) {
          createdAtISO = new Date(data.createdAt.seconds * 1000).toISOString();
        }
        if (data.updatedAt?.seconds) {
          updatedAtISO = new Date(data.updatedAt.seconds * 1000).toISOString();
        }
      } catch (err) {
        console.warn("Invalid timestamps in portfolio:", doc.id);
      }

      portfolio = {
        id: doc.id,
        ...data,
        // Always return normalized slug for consistent URLs
        slug: normalizeSlug(data.slug),
        createdAt: createdAtISO,
        updatedAt: updatedAtISO,
      };
    });

    return NextResponse.json({ success: true, portfolio });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch portfolio",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
