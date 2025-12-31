import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export async function GET() {
  try {
    const sponsoredQuery = query(
      collection(db, "xenotix_sponsored"),
      orderBy("createdAt", "desc"),
      limit(1) // Only get the latest carousel
    );
            
    const snapshot = await getDocs(sponsoredQuery);
    const items = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      items.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate()?.toISOString() || null,
        updatedAt: data.updatedAt?.toDate()?.toISOString() || null,
      });
    });

    return NextResponse.json(
      {
        success: true,
        items,
        total: items.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching sponsored items:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch sponsored items",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}