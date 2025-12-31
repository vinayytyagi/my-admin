import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const featureDoc = doc(db, "home", "feature");
    const docSnap = await getDoc(featureDoc);
    
    if (docSnap.exists()) {
      return NextResponse.json({ 
        success: true, 
        feature: { id: docSnap.id, ...docSnap.data() } 
      });
    } else {
      // Return default structure if no data exists
      return NextResponse.json({ 
        success: true, 
        feature: {
          clients: []
        }
      });
    }
  } catch (error) {
    console.error("Error fetching feature data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch feature data",
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
    const featureDoc = doc(db, "home", "feature");
    const existingDoc = await getDoc(featureDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    // Merge new data with existing data
    const updatedData = {
      ...existingData,
      ...data,
      // Ensure clients array is preserved if not provided
      clients: data.clients !== undefined ? data.clients : existingData.clients || []
    };
    
    // Save to Firestore
    await setDoc(featureDoc, updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Feature section saved successfully" 
    });
  } catch (error) {
    console.error("Error saving feature data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save feature data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}