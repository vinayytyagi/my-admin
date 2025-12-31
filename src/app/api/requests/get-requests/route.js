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

    // ───────────────────────── query-string params
    const status = searchParams.get("status");   // eg. "open" | "closed"
    const sort   = searchParams.get("order");    // "oldest" | "recent" (default)
    const search = searchParams.get("q");        // keyword across multiple fields

    // base collection
    const colRef  = collection(db, "Requests");
    const filters = [];

    // optional status filter
    if (status) filters.push(where("status", "==", status));

    // sort order
    if (sort === "oldest") {
      filters.push(orderBy("createdAt", "asc"));
    } else {
      filters.push(orderBy("createdAt", "desc")); // default
    }

    // Firestore query + fetch
    const snap       = await getDocs(query(colRef, ...filters));
    let   requests   = [];

    snap.forEach((doc) => {
      const data = doc.data();

      // normalise Firestore Timestamp → ISO string
      let createdAtISO = new Date().toISOString();
      try {
        if (data.createdAt?.seconds) {
          createdAtISO = new Date(data.createdAt.seconds * 1000).toISOString();
        } else if (typeof data.createdAt === "string" || typeof data.createdAt === "number") {
          createdAtISO = new Date(data.createdAt).toISOString();
        }
      } catch {
        console.warn("Invalid createdAt in request:", doc.id);
      }

      requests.push({
        id: doc.id,
        ...data,
        createdAt: createdAtISO,
      });
    });

    // ───────────────────────── client-side keyword search
    if (search) {
      const q = search.trim().toLowerCase();
      requests = requests.filter((r) =>
        (r.name?.toLowerCase().includes(q))          ||
        (r.email?.toLowerCase().includes(q))         ||
        (r.phone?.toLowerCase().includes(q))         ||
        (r.requirement?.toLowerCase().includes(q))   ||
        (r.description?.toLowerCase().includes(q))   // NEW field
      );
    }

    console.log("Fetched requests:", requests.length);
    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch requests", error: error.message },
      { status: 500 }
    );
  }
}
