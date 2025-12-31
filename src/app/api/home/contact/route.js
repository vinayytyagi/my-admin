import { NextResponse } from "next/server";
import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function GET(request) {
  try {
    const contactDoc = doc(db, "home", "contact");
    const docSnap = await getDoc(contactDoc);
    
    if (docSnap.exists()) {
      return NextResponse.json({ 
        success: true, 
        contact: { id: docSnap.id, ...docSnap.data() } 
      });
    } else {
      // Return default structure if no data exists
      return NextResponse.json({ 
        success: true, 
        contact: {
          heading: "Contact with me to sizzle your project",
          subheading: "Ready to bring your vision to life? Let's collaborate and create something amazing together.",
          quickCall: {
            title: "Quick Call",
            phone: "+1 (555) 123-4567"
          },
          emailUs: {
            title: "Email Us",
            email: "hello@company.com"
          },
          visitOffice: {
            title: "Visit Our Office",
            address: "123 Business Ave",
            city: "New York, NY 10001"
          }
        }
      });
    }
  } catch (error) {
    console.error("Error fetching contact data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch contact data",
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
    const contactDoc = doc(db, "home", "contact");
    const existingDoc = await getDoc(contactDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    // Merge new data with existing data
    const updatedData = {
      ...existingData,
      ...data
    };
    
    // Save to Firestore
    await setDoc(contactDoc, updatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Contact section saved successfully" 
    });
  } catch (error) {
    console.error("Error saving contact data:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save contact data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

