import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

export async function DELETE(request, { params }) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Portfolio slug is required" },
        { status: 400 }
      );
    }

    const q = query(collection(db, "xenotix_portfolios"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const docRef = snapshot.docs[0].ref;
    await deleteDoc(docRef);

    return NextResponse.json(
      {
        success: true,
        message: "Portfolio deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      {
        error: "Failed to delete portfolio",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}