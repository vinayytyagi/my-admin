import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const mobileDoc = doc(db, "home", "mobile");
    const docSnap = await getDoc(mobileDoc);
    
    if (docSnap.exists()) {
      return NextResponse.json({ 
        success: true, 
        mobile: { id: docSnap.id, ...docSnap.data() } 
      });
    } else {
      // Return default structure if no data exists
      return NextResponse.json({ 
        success: true, 
        mobile: {
          apps: [],
          header: {
            badgeText: "Mobile Experience",
            title: "Creating Awesome UI/UX Experiences",
            description: "We specialize in creating exceptional UI/UX designs that deliver outstanding digital experiences"
          }
        }
      });
    }
  } catch (error) {
    console.error("Error fetching mobile data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch mobile data",
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
    const mobileDoc = doc(db, "home", "mobile");
    const existingDoc = await getDoc(mobileDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    // Merge new data with existing data
    const updatedData = {
      ...existingData,
      ...data,
      // Ensure apps array is preserved if not provided
      apps: data.apps !== undefined ? data.apps : existingData.apps || []
    };
    
    // Save to Firestore
    await setDoc(mobileDoc, updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Mobile section saved successfully" 
    });
  } catch (error) {
    console.error("Error saving mobile data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save mobile data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

