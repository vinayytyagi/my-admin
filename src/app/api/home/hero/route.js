import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const heroDoc = doc(db, "home", "hero");
    const docSnap = await getDoc(heroDoc);
    
    if (docSnap.exists()) {
      return NextResponse.json({ 
        success: true, 
        hero: { id: docSnap.id, ...docSnap.data() } 
      });
    } else {
      // Return default structure if no data exists
      return NextResponse.json({ 
        success: true, 
        hero: {
          clients: []
        }
      });
    }
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch hero data",
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
    const heroDoc = doc(db, "home", "hero");
    const existingDoc = await getDoc(heroDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    // Merge new data with existing data
    const updatedData = {
      ...existingData,
      ...data,
      // Ensure clients array is preserved if not provided
      clients: data.clients !== undefined ? data.clients : existingData.clients || []
    };
    
    // Save to Firestore
    await setDoc(heroDoc, updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Hero section saved successfully" 
    });
  } catch (error) {
    console.error("Error saving hero data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save hero data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}