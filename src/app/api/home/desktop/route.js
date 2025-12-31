import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const desktopDoc = doc(db, "home", "desktop");
    const docSnap = await getDoc(desktopDoc);
    
    if (docSnap.exists()) {
      return NextResponse.json({ 
        success: true, 
        desktop: { id: docSnap.id, ...docSnap.data() } 
      });
    } else {
      // Return default structure if no data exists
      return NextResponse.json({ 
        success: true, 
        desktop: {
          apps: [],
          header: {
            badgeText: "Desktop Experience",
            title: "Our Featured Projects Showcase",
            description: "From initial design concepts to final development, we handle the complete process to deliver exceptional digital experiences"
          }
        }
      });
    }
  } catch (error) {
    console.error("Error fetching desktop data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch desktop data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    // Get existing data to merge
    const desktopDoc = doc(db, "home", "desktop");
    const existingDoc = await getDoc(desktopDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    // Merge new data with existing data
    const updatedData = {
      ...existingData,
      ...data,
      // Ensure apps array is preserved if not provided
      apps: data.apps !== undefined ? data.apps : existingData.apps || []
    };
    
    // Save to Firestore
    await setDoc(desktopDoc, updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Desktop section saved successfully" 
    });
  } catch (error) {
    console.error("Error saving desktop data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save desktop data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

