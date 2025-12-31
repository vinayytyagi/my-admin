import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const sort = searchParams.get("order");
    const search = searchParams.get("title");

    let q = collection(db, "xenotix_portfolios");

    const filters = [];

    if (status) {
      filters.push(where("status", "==", status));
    }

    if (sort === "oldest") {
      filters.push(orderBy("createdAt", "asc"));
    } else if (sort === "a-z") {
      filters.push(orderBy("title", "asc"));
    } else {
      filters.push(orderBy("createdAt", "desc"));
    }

    const finalQuery = query(q, ...filters);
    const querySnapshot = await getDocs(finalQuery);

    let portfolios = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      let createdAtISO = new Date().toISOString();
      try {
        if (data.createdAt?.seconds) {
          createdAtISO = new Date(data.createdAt.seconds * 1000).toISOString();
        } else if (typeof data.createdAt === "string") {
          createdAtISO = new Date(data.createdAt).toISOString();
        }
      } catch (err) {
        console.warn("Invalid createdAt in portfolio:", doc.id);
      }

      portfolios.push({
        id: doc.id,
        ...data,
        createdAt: createdAtISO,
      });
    });

    if (search) {
      const lowerSearch = search.toLowerCase();
      portfolios = portfolios.filter((portfolio) =>
        portfolio.title?.toLowerCase().includes(lowerSearch)
      );
    }

    return NextResponse.json({ success: true, portfolios });
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch portfolios",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
