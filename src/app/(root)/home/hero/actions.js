"use server";

import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getHeroData() {
  try {
    const heroDoc = doc(db, "home", "hero");
    const docSnap = await getDoc(heroDoc);
    
    if (docSnap.exists()) {
      return {
        success: true,
        hero: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return {
        success: true,
        hero: {
          clients: [],
          badgeText: "",
          mainHeading: "",
          description: "",
          ctaButtonText: "",
          ctaButtonLink: "",
          icons: []
        }
      };
    }
  } catch (error) {
    console.error("Error fetching hero data:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function saveHeroData(data) {
  try {
    const heroDoc = doc(db, "home", "hero");
    const existingDoc = await getDoc(heroDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    const updatedData = {
      ...existingData,
      ...data,
      clients: data.clients !== undefined ? data.clients : existingData.clients || []
    };
    
    await setDoc(heroDoc, updatedData);
    
    revalidatePath("/home/hero");
    
    return {
      success: true,
      message: "Hero section saved successfully"
    };
  } catch (error) {
    console.error("Error saving hero data:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

