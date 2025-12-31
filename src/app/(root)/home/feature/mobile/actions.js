"use server";

import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getMobileData() {
  try {
    const mobileDoc = doc(db, "home", "mobile");
    const docSnap = await getDoc(mobileDoc);
    
    if (docSnap.exists()) {
      return {
        success: true,
        mobile: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return {
        success: true,
        mobile: {
          apps: [],
          header: {
            badgeText: "Mobile Experience",
            title: "Creating Awesome UI/UX Experiences",
            description: "We specialize in creating exceptional UI/UX designs that deliver outstanding digital experiences"
          }
        }
      };
    }
  } catch (error) {
    console.error("Error fetching mobile data:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function saveMobileData(data) {
  try {
    const mobileDoc = doc(db, "home", "mobile");
    const existingDoc = await getDoc(mobileDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    const updatedData = {
      ...existingData,
      ...data,
      apps: data.apps !== undefined ? data.apps : existingData.apps || []
    };
    
    await setDoc(mobileDoc, updatedData);
    
    revalidatePath("/home/feature/mobile");
    
    return {
      success: true,
      message: "Mobile section saved successfully"
    };
  } catch (error) {
    console.error("Error saving mobile data:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

