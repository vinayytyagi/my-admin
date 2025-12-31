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

    let q = collection(db, "xenotix_blogs");

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

    let blogs = [];

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
        console.warn("Invalid createdAt in blog:", doc.id);
      }

      blogs.push({
        id: doc.id,
        ...data,
        createdAt: createdAtISO,
      });
    });

    // Apply search filter (title match) after fetching
    if (search) {
      const lowerSearch = search.toLowerCase();
      blogs = blogs.filter((blog) =>
        blog.title?.toLowerCase().includes(lowerSearch)
      );
    }

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
