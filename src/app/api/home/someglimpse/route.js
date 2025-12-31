import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const someGlimpseDoc = doc(db, "home", "someglimpse");
    const docSnap = await getDoc(someGlimpseDoc);
    
    if (docSnap.exists()) {
      return NextResponse.json({ 
        success: true, 
        someGlimpse: { id: docSnap.id, ...docSnap.data() } 
      });
    } else {
      // Return default structure if no data exists
      return NextResponse.json({ 
        success: true, 
        someGlimpse: {
          stories: [],
          header: {
            badgeText: "PROJECT STORIES",
            title: "Some Glimpse",
            description: "Journey through our most impactful projects and see how we transform ideas into digital experiences"
          }
        }
      });
    }
  } catch (error) {
    console.error("Error fetching SomeGlimpse data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch SomeGlimpse data",
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
    const someGlimpseDoc = doc(db, "home", "someglimpse");
    const existingDoc = await getDoc(someGlimpseDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    // Merge new data with existing data
    const updatedData = {
      ...existingData,
      ...data,
      // Ensure stories array is preserved if not provided
      stories: data.stories !== undefined ? data.stories : existingData.stories || []
    };
    
    // Save to Firestore
    await setDoc(someGlimpseDoc, updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: "SomeGlimpse section saved successfully" 
    });
  } catch (error) {
    console.error("Error saving SomeGlimpse data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save SomeGlimpse data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

