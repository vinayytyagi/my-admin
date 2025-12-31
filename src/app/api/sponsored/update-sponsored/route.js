import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, updateDoc, getDoc, Timestamp } from "firebase/firestore";

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
            
    if (!id) {
      return NextResponse.json(
        { error: "Sponsored item ID is required" },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.heading) {
      return NextResponse.json(
        { error: "Heading is required" },
        { status: 400 }
      );
    }
    
    if (!data.images || data.images.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 }
      );
    }
    
    for (let i = 0; i < data.images.length; i++) {
      const image = data.images[i];
      if (!image.url || !image.href || !image.label) {
        return NextResponse.json(
          { 
            error: "Each image must have URL, href, and label",
            missingFields: {
              index: i,
              url: !image.url,
              href: !image.href,
              label: !image.label
            }
          },
          { status: 400 }
        );
      }
    }

    const docRef = doc(db, "xenotix_sponsored", id);
            
    // Check if document exists
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: "Sponsored item not found" },
        { status: 404 }
      );
    }

    const updateData = {
      heading: data.heading.trim(),
      images: data.images.map(img => ({
        url: img.url.trim(),
        href: img.href.trim(),
        label: img.label.trim()
      })),
      updatedAt: Timestamp.now(),
    };

    await updateDoc(docRef, updateData);

    return NextResponse.json(
      {
        success: true,
        sponsoredId: id,
        message: "Sponsored carousel updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating sponsored carousel:", error);
    return NextResponse.json(
      {
        error: "Failed to update sponsored carousel",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}