"use server";

import { db } from "@/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";

export async function getDesktopData() {
  try {
    const desktopDoc = doc(db, "home", "desktop");
    const docSnap = await getDoc(desktopDoc);
    
    if (docSnap.exists()) {
      return {
        success: true,
        desktop: { id: docSnap.id, ...docSnap.data() }
      };
    } else {
      return {
        success: true,
        desktop: {
          apps: [],
          header: {
            badgeText: "Desktop Experience",
            title: "Our Featured Projects Showcase",
            description: "From initial design concepts to final development, we handle the complete process to deliver exceptional digital experiences"
          }
        }
      };
    }
  } catch (error) {
    console.error("Error fetching desktop data:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function saveDesktopData(data) {
  try {
    const desktopDoc = doc(db, "home", "desktop");
    const existingDoc = await getDoc(desktopDoc);
    const existingData = existingDoc.exists() ? existingDoc.data() : {};
    
    const updatedData = {
      ...existingData,
      ...data,
      apps: data.apps !== undefined ? data.apps : existingData.apps || []
    };
    
    await setDoc(desktopDoc, updatedData);
    
    revalidatePath("/home/feature/desktop");
    
    return {
      success: true,
      message: "Desktop section saved successfully"
    };
  } catch (error) {
    console.error("Error saving desktop data:", error);
    return {
      success: false,
      error: error.message
    };
  }
}

