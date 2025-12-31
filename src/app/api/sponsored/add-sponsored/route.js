import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(request) {
  try {
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

    const sponsoredData = {
      heading: data.heading.trim(),
      images: data.images.map(img => ({
        url: img.url.trim(),
        href: img.href.trim(),
        label: img.label.trim()
      })),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true,
    };

    const docRef = await addDoc(
      collection(db, "xenotix_sponsored"),
      sponsoredData
    );

    return NextResponse.json(
      {
        success: true,
        sponsoredId: docRef.id,
        message: "Sponsored carousel added successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding sponsored carousel:", error);
    return NextResponse.json(
      {
        error: "Failed to add sponsored carousel",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}